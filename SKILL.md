---
name: raw-to-stack
description: >
  一键自动处理相机 Raw → Lightroom Classic 导出 TIFF → RoboTou Stacker 堆叠的完整工作流。
  务必触发此 skill 的场景：用户提到处理 raw 文件（.CR2/.NEF/.ARW 等）、需要用 Lightroom 导出并堆叠、用到 RoboTou 堆叠软件、想要从 raw 到堆叠结果的一键自动化。
  Lightroom Classic 是中文界面，RoboTou Stacker 安装在 /Applications 目录。
---

# Raw to Stack

自动化完成：导入 raw → 用预设导出 16-bit TIFF → RoboTou Stacker 自动堆叠。

## 工作流

```
1. 输入 raw 文件夹路径
2. 导入 raw 到 Lightroom Classic
3. 全选 → 使用预设「robotou daochu」导出到子文件夹「矫正」
4. 打开 RoboTou Stacker → 设置输入文件夹为「矫正」
5. 堆栈数量 =「矫正」文件夹中的 TIFF 文件数量
6. 自动创建蒙版成功后 → 点击开始
7. 等待堆栈完成
```

## 使用方式

把存放了 raw 照片的文件夹交给 skill，它会自动完成后续所有步骤。例如：请用 skill 帮我处理这批文件的预处理。

```bash
bash <skill-path>/scripts/run.sh <文件夹>
```

## 先决条件

- Lightroom Classic
- RoboTou Stacker（/Applications/RoboTou Stacker.app）
- Lightroom 导出预设「robotou daochu」，**必须包含以下设置**：
  - ✅ 勾选 **移除色差**（Remove Chromatic Aberration）
  - ✅ 勾选 **启用配置文件矫正**（Enable Profile Corrections）
  - 导出格式：16-bit TIFF
  - 其他导出参数根据需求设置（分辨率、色彩空间等）
- macOS 辅助功能权限（系统设置 → 隐私 → 辅助功能）

## 脚本说明

| 脚本 | 功能 |
|------|------|
| `scripts/run.sh` | 主入口 |
| `scripts/lr_workflow.applescript` | Lightroom 导入+导出自动化 |
| `scripts/robotou_workflow.applescript` | RoboTou Stacker 自动化 |

## 错误处理

- 导入失败：手动点击「导入」
- 导出弹出文件夹对话框：脚本自动填入路径，失败则手动选择
- RoboTou 失败：手动设置输入文件夹并点击开始
