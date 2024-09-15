#!/bin/bash

# 获取上一次提交的哈希
LAST_COMMIT=$(git rev-parse HEAD)

# 获取更改的文件
CHANGED_FILES=$(git diff --name-only $LAST_COMMIT^ $LAST_COMMIT)

# 提取文件夹路径并去重
CHANGED_DIRS=$(echo "$CHANGED_FILES" | grep '/' | sed 's|/[^/]*$||' | sort -u)

# 输出更改的目录
echo "$CHANGED_DIRS"
