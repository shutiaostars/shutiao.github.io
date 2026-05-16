(*
  robotou_workflow.applescript
  RoboTou Stacker 自动化（基于无障碍 API 元素定位）：
  1. 打开软件，选择星空模式
  2. 设置输入图像文件夹
  3. 设置堆叠数量
  4. 点击开始
*)

on run argv
    if (count of argv) < 1 then
        log "用法: robotou_workflow.applescript <tif_folder> [stack_count]"
        return
    end if

    set tifFolder to item 1 of argv
    set stackCount to "1"
    if (count of argv) > 1 then
        set stackCount to item 2 of argv
    end if

    log "=== RoboTou Stacker 开始 ==="
    log "TIFF 目录: " & tifFolder
    log "堆叠数量: " & stackCount

    -- 打开 RoboTou Stacker
    try
        do shell script "open -a 'RoboTou Stacker'"
        log "  ✓ 已打开"
    on error
        log "  ⚠ 无法打开 RoboTou Stacker"
        return
    end try
    delay 5

    tell application "System Events"
        tell process "RoboTou Stacker"
            -- 确保窗口 1 在最前
            try
                set focused of window 1 to true
            end try
            delay 1

            -- [1/4] 选择星空模式（坐标: 中心 51,93）
            log "[1/4] 选择星空模式..."
            try
                click at {51, 93}
                log "  ✓ 已选星空模式"
            on error
                log "  ⚠ 请手动选择星空模式"
            end try
            delay 1

            -- [2/4] 设置输入图像文件夹（坐标: 中心 210,170）
            log "[2/4] 设置输入图像文件夹..."
            try
                click at {210, 170}
                log "  ✓ 已点击选择文件夹按钮"
                delay 3

                -- 处理文件夹选择对话框
                do shell script "mkdir -p " & quoted form of tifFolder
                delay 1
                set the clipboard to tifFolder
                delay 1
                keystroke "g" using {command down, shift down}
                delay 2
                keystroke "v" using command down
                delay 2
                keystroke return
                delay 2
                keystroke return
                log "  ✓ 已设置输入文件夹"
            on error err
                log "  ⚠ 设置输入文件夹失败: " & err
            end try

            delay 2

            -- [3/4] 设置堆叠数量
            log "[3/4] 设置堆叠数量..."
            try
                click at {250, 507}
                delay 0.5
            end try
        end tell
    end tell

    -- 在 process tell 之外进行 activate + keystroke，确保生效
    try
        tell application "RoboTou Stacker" to activate
        delay 0.5
        tell application "System Events"
            keystroke "a" using command down
            delay 0.3
            keystroke stackCount
            keystroke return
        end tell
        log "  ✓ 已设堆叠数量: " & stackCount
    on error err
        log "  ⚠ 设置堆叠数量失败: " & err
    end try

    delay 2

    -- [4/4] 点击开始
    log "[4/4] 点击开始..."
    tell application "System Events"
        tell process "RoboTou Stacker"
            try
                click button "开始" of window 1
                log "  ✓ 已开始堆叠"
            on error
                try
                    click at {210, 544}
                    log "  ✓ 已点击开始（坐标）"
                on error
                    log "  ⚠ 请手动点击开始"
                end try
            end try
        end tell
    end tell

    -- 等待堆叠完成
    log "等待堆叠完成..."
    delay 30

    log "=== RoboTou 处理完成 ==="
end run
