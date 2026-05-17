(*
  lr_workflow.applescript
  Lightroom 工作流自动化：
  1. 导入 raw 文件
  2. 用预设导出 TIFF 到子文件夹「矫正」
*)

on run argv
    if (count of argv) < 1 then
        log "用法: lr_workflow.applescript <raw_folder>"
        return
    end if

    set rawFolder to item 1 of argv
    set outputFolder to rawFolder & "/矫正"

    log "=== Lightroom 工作流开始 ==="
    log "输入: " & rawFolder
    log "输出: " & outputFolder

    -- ============================================================ --
    -- 第一步：导入 raw
    -- ============================================================ --
    log "[1/2] 导入 raw 文件..."

    tell application "Adobe Lightroom Classic"
        activate
    end tell
    delay 3

    do shell script "open -a 'Adobe Lightroom Classic' " & quoted form of rawFolder
    delay 8

    tell application "System Events"
        tell process "Adobe Lightroom Classic"
            try
                click button "导入" of window 1
                log "  ✓ 已点击导入"
            on error
                try
                    click button "Import" of window 1
                on error
                    keystroke return
                end try
            end try
        end tell
    end tell

    delay 25

    -- ============================================================ --
    -- 第二步：导出 TIFF
    -- ============================================================ --
    log "[2/2] 导出 TIFF..."

    tell application "System Events"
        tell process "Adobe Lightroom Classic"
            -- 全选照片
            keystroke "g"
            delay 2
            try
                click menu item "全选" of menu "编辑" of menu bar 1
            on error
                try
                    click menu item "Select All" of menu "Edit" of menu bar 1
                on error
                    keystroke "a" using command down
                end try
            end try
            delay 2

            -- 方式 A：菜单导出
            try
                click menu item "robotou daochu" of menu of menu item "使用预设导出" of menu "文件" of menu bar 1
                log "  ✓ 已通过菜单导出"
                delay 5
            on error
                -- 方式 B：导出对话框
                log "  → 使用导出对话框..."
                keystroke "e" using {command down, shift down}
                delay 6
                keystroke "robotou daochu"
                delay 3
                keystroke return
                delay 3
                keystroke return
                log "  ✓ 已导出"
                delay 5
            end try

            -- 创建并设置输出目录
            do shell script "mkdir -p " & quoted form of outputFolder
            delay 2

            try
                set the clipboard to outputFolder
                delay 1
                keystroke "g" using {command down, shift down}
                delay 2
                keystroke "v" using command down
                delay 2
                keystroke return
                delay 2
                keystroke return
                log "  ✓ 已设置输出目录"
            on error err
                log "  ⚠ 文件夹对话框: " & err
            end try
        end tell
    end tell

    log ""
    log "=== Lightroom 完成 ==="
    log "TIFF → " & outputFolder
end run
