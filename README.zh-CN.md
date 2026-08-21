# Agent Sync Hub

[English](README.md) | [简体中文](README.zh-CN.md)

Agent Sync Hub 是一个本地优先的桌面控制中心，用于发现编程 Agent 的技能；后续版本将逐步支持安全同步技能、MCP 服务、Hooks 与共享记忆。

公开的 `0.1.x` 系列刻意保持只读：它扫描用户电脑上的已知 Agent 目录并生成本地可用性矩阵，不上传任何内容，也不修改 Agent 配置。桌面界面会自动跟随系统语言，并可随时在中文和英文之间切换。

## 下载

带版本标签的 Release 会通过 GitHub Actions 构建以下安装包：

- Windows x64 — NSIS `.exe`
- Windows ARM64 — NSIS `.exe`
- macOS Intel — `.dmg` 与 `.zip`
- macOS Apple Silicon — `.dmg` 与 `.zip`

预览版本尚未签名，操作系统可能显示安全提醒。代码签名与 Apple 公证需要维护者证书，因此单独列入后续计划。

## 从源码运行

需要 Node.js 22 或更高版本。

```bash
npm ci
npm start
```

运行测试与语法检查：

```bash
npm run check
```

## 安全模型

- 首个公开版本只读取本地清单。
- Electron 渲染进程启用上下文隔离与沙箱，且不启用 Node 集成。
- 严格的内容安全策略会阻止远程脚本和网络连接。
- 扫描器不会遍历符号链接目录。
- 运行状态、备份、环境变量文件和签名密钥均排除在 Git 之外。
- 扫描结果为空或格式异常时会明确报错，不会以静默的 `{}` 伪装成功。

详见 [SECURITY.md](SECURITY.md)、[PRIVACY.md](PRIVACY.md) 与 [ROADMAP.md](ROADMAP.md)。

## 参与贡献

欢迎提交缺陷报告、Agent 适配建议、文档改进与跨平台测试结果。提交 Pull Request 前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

采用 MIT 许可证，详见 [LICENSE](LICENSE) 与 [NOTICE](NOTICE)。
