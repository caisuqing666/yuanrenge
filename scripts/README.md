# Gemini API 使用指南

本目录包含使用 Google Cloud 服务账号密钥调用 Gemini API 的示例代码。

## 安装依赖

```bash
pip install -r requirements.txt
```

## 配置环境变量

### 方法1: 使用 .env 文件（推荐）

1. 复制示例文件：
```bash
cp env.example .env
```

2. 编辑 `.env` 文件，设置你的密钥文件路径：
```bash
GOOGLE_APPLICATION_CREDENTIALS=/Users/yourname/path/to/service-account-key.json
GEMINI_API_KEY=your-api-key-here
```

3. 使用 `python-dotenv` 加载环境变量（可选）：
```bash
pip install python-dotenv
```

然后在代码开头添加：
```python
from dotenv import load_dotenv
load_dotenv()
```

### 方法2: 直接在终端设置环境变量

**macOS/Linux:**
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
export GEMINI_API_KEY="your-api-key-here"
```

**Windows (PowerShell):**
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\service-account-key.json"
$env:GEMINI_API_KEY="your-api-key-here"
```

**Windows (CMD):**
```cmd
set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\your\service-account-key.json
set GEMINI_API_KEY=your-api-key-here
```

### 方法3: 在系统级别设置（永久）

**macOS/Linux:**
编辑 `~/.bashrc` 或 `~/.zshrc`：
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
export GEMINI_API_KEY="your-api-key-here"
```

然后运行：
```bash
source ~/.bashrc  # 或 source ~/.zshrc
```

**Windows:**
1. 右键"此电脑" -> 属性
2. 高级系统设置 -> 环境变量
3. 在"用户变量"中添加新变量

## 运行示例

项目提供了三个示例文件，你可以根据需要选择：

### 1. 完整示例（推荐用于学习和理解）
```bash
python scripts/gemini_api_example.py
```
- 包含完整的错误处理
- 支持多种凭证加载方式
- 详细的故障排除信息

### 2. 简化示例（快速上手）
```bash
python scripts/gemini_simple_example.py
```
- 代码更简洁
- 核心功能完整
- 适合快速测试

### 3. 使用 .env 文件（生产环境推荐）
```bash
python scripts/gemini_with_dotenv.py
```
- 使用 `.env` 文件管理配置
- 代码更安全
- 推荐用于生产环境

## 重要说明

### 关于 Gemini API 和服务账号

⚠️ **重要**: Gemini API 通常使用 **API Key** 而不是服务账号进行认证。

- **API Key 方式**（推荐）: 直接在 Google AI Studio 获取 API Key
- **服务账号方式**: 主要用于其他 Google Cloud 服务，Gemini API 对服务账号的支持可能有限

如果你的场景确实需要使用服务账号，可能需要：
1. 启用 Generative Language API
2. 确保服务账号有相应权限
3. 使用 OAuth2 流程进行认证

### 安全建议

1. **永远不要**将密钥文件提交到 Git
2. 将 `.env` 和密钥文件添加到 `.gitignore`
3. 使用环境变量而不是硬编码
4. 定期轮换密钥
5. 限制服务账号的权限范围

## 故障排除

### 错误: "未找到服务账号凭证"
- 检查环境变量是否正确设置
- 确认 JSON 文件路径是否正确
- 尝试使用绝对路径

### 错误: "API Key 无效"
- 确认 API Key 是否正确
- 检查是否在 Google AI Studio 中启用了 API

### 错误: "权限不足"
- 确认服务账号有 Generative Language API 的访问权限
- 检查项目是否正确配置

