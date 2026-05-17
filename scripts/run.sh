#!/bin/bash
# run.sh - Raw to Stack 一键自动化
# 完整流程：
#   Lightroom 导入 raw → 导出 TIFF → RoboTou Stacker 堆叠
#
# 用法: bash run.sh <raw目录>

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
INPUT_DIR="${1%/}"

if [ -z "$INPUT_DIR" ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "用法: $0 <raw文件目录>"
    echo "示例: $0 ~/Photos/星空"
    exit 0
fi

[ ! -d "$INPUT_DIR" ] && echo "错误: 目录不存在: $INPUT_DIR" && exit 1

OUTPUT_DIR="$INPUT_DIR/矫正"

echo "============================================"
echo "  Raw to Stack - 一键自动化"
echo "============================================"
echo "  Raw 目录: $INPUT_DIR"
echo "  导出目录: $OUTPUT_DIR"
echo ""

# 检查环境
echo "[环境] 检查..."
LR_PATH="/Applications/Adobe Lightroom Classic/Adobe Lightroom Classic.app"
[ -d "$LR_PATH" ] && echo "  ✓ Lightroom Classic" || echo "  ⚠ Lightroom 未安装"
[ -d "/Applications/RoboTou Stacker.app" ] && echo "  ✓ RoboTou Stacker" || echo "  ⚠ RoboTou 未安装"

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

# 第一阶段：Lightroom
echo ""
echo "============================================"
echo "  第一阶段: Lightroom 导入+导出"
echo "============================================"

osascript "$SKILL_DIR/scripts/lr_workflow.applescript" "$INPUT_DIR" 2>&1

echo ""
echo "============================================"
echo "  第一阶段完成"
echo "============================================"

# 自动轮询等待 TIFF 导出完成（最多等 5 分钟）
echo "⏳ 等待 Lightroom 导出 TIFF..."
for i in $(seq 1 60); do
    sleep 5
    tif_count=$(ls "$OUTPUT_DIR"/*.tif 2>/dev/null | wc -l | tr -d ' ')
    if [ "$tif_count" -gt 0 ]; then
        echo "  ✓ 检测到 $tif_count 个 TIFF 文件"
        break
    fi
    if [ $((i % 6)) -eq 0 ]; then
        echo "  ⏳ 仍在等待...（${i}s）"
    fi
done

if [ "$tif_count" -eq 0 ]; then
    echo "  ⚠ 等待超时，未找到 TIFF 文件，跳过 RoboTou"
    exit 0
fi

# 第二阶段：RoboTou Stacker
echo ""
echo "============================================"
echo "  第二阶段: RoboTou Stacker 堆叠"
echo "============================================"
echo "  TIFF 文件: $tif_count 个"

osascript "$SKILL_DIR/scripts/robotou_workflow.applescript" "$OUTPUT_DIR" "$tif_count" 2>&1

echo ""
echo "============================================"
echo "  全部完成！"
echo "============================================"
echo "  Raw 目录: $INPUT_DIR"
echo "  TIFF 导出: $OUTPUT_DIR"
echo ""
