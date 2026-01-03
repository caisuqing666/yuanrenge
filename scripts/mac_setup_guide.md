# Mac 上设置 GOOGLE_APPLICATION_CREDENTIALS 环境变量指南

## 🎯 三种设置方法

### 方法 1: 临时设置（当前终端窗口有效）

适合：临时测试，关闭终端后失效

```bash
# 替换成你的实际文件路径
export GOOGLE_APPLICATION_CREDENTIALS="/Users/你的用户名/Downloads/your-key.json"

# 验证是否设置成功
echo $GOOGLE_APPLICATION_CREDENTIALS

# 运行 Python 脚本
python scripts/gemini_service_account.py
```

**示例**：
```bash
# 假设你的密钥文件在 Downloads 文件夹，文件名是 service-account-key.json
export GOOGLE_APPLICATION_CREDENTIALS="/Users/caixiaopi/Downloads/service-account-key.json"
python scripts/gemini_service_account.py
```

---

### 方法 2: 永久设置（推荐）⭐

适合：长期使用，每次打开终端都自动生效

#### 如果你使用 zsh（macOS Catalina 及以后默认）

1. 打开终端
2. 编辑配置文件：
```bash
nano ~/.zshrc
```

3. 在文件末尾添加一行（替换成你的实际路径）：
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/Users/你的用户名/path/to/your-key.json"
```

4. 按 `Ctrl + X` 退出，按 `Y` 确认保存，按 `Enter` 完成

5. 使配置生效：
```bash
source ~/.zshrc
```

6. 验证：
```bash
echo $GOOGLE_APPLICATION_CREDENTIALS
```

#### 如果你使用 bash（较旧的 macOS）

1. 打开终端
2. 编辑配置文件：
```bash
nano ~/.bash_profile
```

3. 在文件末尾添加一行：
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/Users/你的用户名/path/to/your-key.json"
```

4. 保存并退出（同上）

5. 使配置生效：
```bash
source ~/.bash_profile
```

---

### 方法 3: 使用 .env 文件（项目内）

适合：项目专用，不污染系统环境

1. 在项目根目录创建 `.env` 文件：
```bash
cd /Users/caixiaopi/Desktop/meta-persona
nano scripts/.env
```

2. 添加内容：
```
GOOGLE_APPLICATION_CREDENTIALS=/Users/你的用户名/path/to/your-key.json
```

3. 保存退出

4. 在 Python 代码开头添加：
```python
from dotenv import load_dotenv
import os

load_dotenv('scripts/.env')  # 或 load_dotenv() 如果在项目根目录
```

---

## 📝 详细步骤示例

假设你的密钥文件在这里：
`/Users/caixiaopi/Downloads/my-service-account-key.json`

### 步骤 1: 找到你的密钥文件

在 Finder 中：
1. 打开 Finder
2. 找到下载的 JSON 密钥文件
3. 右键点击文件，选择"显示简介"
4. 复制"位置"中的完整路径（包括文件名）

或者直接在终端查看：
```bash
ls ~/Downloads/*.json
```

### 步骤 2: 设置环境变量（选择一种方法）

**临时设置**：
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/Users/caixiaopi/Downloads/my-service-account-key.json"
```

**永久设置**：
```bash
# 1. 打开配置文件
nano ~/.zshrc

# 2. 在文件末尾添加（替换成你的实际路径）
export GOOGLE_APPLICATION_CREDENTIALS="/Users/caixiaopi/Downloads/my-service-account-key.json"

# 3. 保存退出（Ctrl+X, Y, Enter）

# 4. 使配置生效
source ~/.zshrc
```

### 步骤 3: 验证设置

```bash
# 查看环境变量值
echo $GOOGLE_APPLICATION_CREDENTIALS

# 应该显示你的文件路径，例如：
# /Users/caixiaopi/Downloads/my-service-account-key.json
```

### 步骤 4: 运行脚本

```bash
cd /Users/caixiaopi/Desktop/meta-persona
python scripts/gemini_service_account.py
```

---

## ⚠️ 常见问题

### 问题 1: "未找到环境变量"

**原因**：环境变量没有设置成功

**解决**：
1. 检查命令是否输入正确
2. 如果是永久设置，记得运行 `source ~/.zshrc`
3. 关闭并重新打开终端窗口

### 问题 2: "找不到密钥文件"

**原因**：文件路径不正确

**解决**：
1. 检查路径是否包含文件名（.json）
2. 路径中的空格需要用引号括起来
3. 使用绝对路径（从 / 开始的完整路径）

**示例**：
```bash
# ❌ 错误：没有文件名
export GOOGLE_APPLICATION_CREDENTIALS="/Users/caixiaopi/Downloads"

# ✅ 正确：包含文件名
export GOOGLE_APPLICATION_CREDENTIALS="/Users/caixiaopi/Downloads/my-key.json"
```

### 问题 3: 路径中有空格

如果文件路径中有空格，需要用引号：
```bash
# ✅ 正确
export GOOGLE_APPLICATION_CREDENTIALS="/Users/caixiaopi/My Downloads/key file.json"

# ❌ 错误
export GOOGLE_APPLICATION_CREDENTIALS=/Users/caixiaopi/My Downloads/key file.json
```

---

## ✅ 快速检查清单

- [ ] 找到你的 JSON 密钥文件位置
- [ ] 复制完整路径（包括文件名）
- [ ] 设置环境变量（选择一种方法）
- [ ] 验证环境变量：`echo $GOOGLE_APPLICATION_CREDENTIALS`
- [ ] 运行脚本测试

---

## 💡 提示

- 建议将密钥文件放在安全的位置（不要在 Downloads）
- 可以考虑放在 `~/.config/google/` 目录
- 永久设置后，每次打开新终端都会自动加载

