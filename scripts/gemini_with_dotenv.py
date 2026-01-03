"""
使用 .env 文件管理环境变量的 Gemini API 示例

这是最推荐的方式，可以避免在代码中硬编码密钥。

使用步骤：
1. 安装依赖: pip install python-dotenv requests google-auth
2. 复制 .env.example 为 .env 并填入你的密钥文件路径
3. 运行: python scripts/gemini_with_dotenv.py
"""

import os
from dotenv import load_dotenv
import requests
from google.oauth2 import service_account
import google.auth.transport.requests

# 加载 .env 文件中的环境变量
load_dotenv()

def get_credentials():
    """从环境变量加载服务账号凭证"""
    key_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    
    if not key_path:
        raise ValueError(
            "❌ 未找到 GOOGLE_APPLICATION_CREDENTIALS 环境变量。\n"
            "请确保 .env 文件已正确配置。"
        )
    
    if not os.path.exists(key_path):
        raise FileNotFoundError(
            f"❌ 密钥文件不存在: {key_path}\n"
            "请检查 .env 文件中的路径是否正确。"
        )
    
    print(f"✓ 加载凭证文件: {key_path}")
    return service_account.Credentials.from_service_account_file(
        key_path,
        scopes=['https://www.googleapis.com/auth/generative-language']
    )


def call_gemini(prompt: str, model: str = "gemini-1.5-pro") -> str:
    """调用 Gemini API"""
    credentials = get_credentials()
    request = google.auth.transport.requests.Request()
    credentials.refresh(request)
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    headers = {
        "Authorization": f"Bearer {credentials.token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        url,
        headers=headers,
        json={"contents": [{"parts": [{"text": prompt}]}]}
    )
    response.raise_for_status()
    
    return response.json()['candidates'][0]['content']['parts'][0]['text']


if __name__ == "__main__":
    try:
        prompt = "什么是深度学习？用一句话解释。"
        print(f"📝 提示: {prompt}\n")
        
        response = call_gemini(prompt)
        print(f"✅ 响应:\n{response}\n")
        
    except Exception as e:
        print(f"❌ 错误: {e}")

