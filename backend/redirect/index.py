'''
Business: Track redirect clicks and return total count
Args: event with httpMethod (GET for count, POST for click), headers, body
Returns: HTTP response with click count
'''
import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
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
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    if method == 'POST':
        headers = event.get('headers', {})
        user_agent = headers.get('user-agent', 'Unknown')
        ip_address = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'Unknown')
        
        cur.execute(
            "INSERT INTO redirect_clicks (user_agent, ip_address) VALUES (%s, %s)",
            (user_agent, ip_address)
        )
        conn.commit()
    
    cur.execute("SELECT COUNT(*) as total FROM redirect_clicks")
    result = cur.fetchone()
    total_clicks = result['total'] if result else 0
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'clicks': total_clicks})
    }
