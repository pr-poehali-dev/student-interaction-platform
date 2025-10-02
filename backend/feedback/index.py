import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

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
