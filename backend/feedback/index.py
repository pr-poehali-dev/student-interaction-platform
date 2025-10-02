import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email_notification(feedback_type: str, name: str, email: str, title: str, message: str) -> None:
    '''
    Отправляет уведомление на почту maksimenkov012@mail.ru
    '''
    api_key = os.environ.get('EMAIL_API_KEY')
    if not api_key:
        return
    
    type_names = {
        'feedback': 'Отзыв',
        'initiative': 'Инициатива',
        'question': 'Вопрос'
    }
    type_name = type_names.get(feedback_type, feedback_type)
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новое сообщение: {type_name}'
    msg['From'] = 'noreply@poehali.dev'
    msg['To'] = 'maksimenkov012@mail.ru'
    
    html_content = f'''
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2 style="color: #2563eb;">Новое сообщение: {type_name}</h2>
        <p><strong>Имя:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Тема:</strong> {title if title else 'Не указана'}</p>
        <hr>
        <p><strong>Сообщение:</strong></p>
        <p>{message}</p>
      </body>
    </html>
    '''
    
    html_part = MIMEText(html_content, 'html')
    msg.attach(html_part)
    
    try:
        with smtplib.SMTP('smtp.sendgrid.net', 587) as server:
            server.starttls()
            server.login('apikey', api_key)
            server.send_message(msg)
    except Exception:
        pass

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для сохранения обратной связи (отзывы, инициативы, вопросы)
    Args: event с httpMethod, body
    Returns: HTTP response с результатом
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            feedback_type = params.get('type')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if feedback_type:
                    cur.execute(
                        'SELECT id, type, name, email, title, message, created_at FROM feedback WHERE type = %s ORDER BY created_at DESC',
                        (feedback_type,)
                    )
                else:
                    cur.execute('SELECT id, type, name, email, title, message, created_at FROM feedback ORDER BY created_at DESC')
                
                items = cur.fetchall()
                
                feedback_list = []
                for item in items:
                    feedback_list.append({
                        'id': item['id'],
                        'type': item['type'],
                        'name': item['name'],
                        'email': item['email'],
                        'title': item['title'],
                        'message': item['message'],
                        'created_at': str(item['created_at'])
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'feedback': feedback_list}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            feedback_type = body_data.get('type', '')
            name = body_data.get('name', '')
            email = body_data.get('email', '')
            title = body_data.get('title', '')
            message = body_data.get('message', '')
            
            if not feedback_type or not name or not message:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "INSERT INTO feedback (type, name, email, title, message) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                    (feedback_type, name, email, title, message)
                )
                new_item = cur.fetchone()
                conn.commit()
                
                send_email_notification(feedback_type, name, email, title, message)
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'id': new_item['id'],
                        'success': True
                    }),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()