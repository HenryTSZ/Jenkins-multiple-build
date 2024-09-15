const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const getChangedDirectories = require('./get-changed-dirs')

// 用于记录已经处理过的目录
const processedDirs = new Set()

// 查找包含 package.json 的目录
function findPackageJsonDir(dir, callback) {
  const packageJsonPath = path.join(dir, 'package.json')

  // 检查当前目录是否包含 package.json
  fs.access(packageJsonPath, fs.constants.F_OK, err => {
    if (!err) {
      // 找到 package.json，执行回调
      callback(dir)
    } else {
      // 如果找不到 package.json，向上查找
      const parentDir = path.dirname(dir)
      if (parentDir !== dir) {
        // 确保不向上移动到根目录
        findPackageJsonDir(parentDir, callback)
      }
    }
  })
}

// 处理目录
function processDirectory(dir) {
  findPackageJsonDir(dir, foundDir => {
    if (processedDirs.has(foundDir)) {
      console.log(`目录 ${foundDir} 已经处理过，跳过。`)
      return
    }
    processedDirs.add(foundDir)

    console.log(`发现 package.json 在 ${foundDir}`)
    // 执行 npm install 和 npm run build
    exec('npm install && npm run build', { cwd: foundDir }, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行命令失败: ${error}`)
        return
      }
      if (stderr) {
        console.error(`标准错误: ${stderr}`)
      }
      console.log(`标准输出: ${stdout}`)
    })
  })
}

// 修改后的 findAndProcessDirectories 函数
function findAndProcessDirectories(dirs) {
  dirs.forEach(dir => {
    processDirectory(dir)
  })
}

// 执行主逻辑
getChangedDirectories(changedDirs => {
  findAndProcessDirectories(changedDirs)
})
