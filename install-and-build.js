const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

// 递归遍历目录
function findAndProcessDirectories(dir) {
  fs.readdir(dir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error(`无法读取目录 ${dir}: ${err}`)
      return
    }

    // 遍历目录中的每个条目
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name)

      // 排除 node_modules 目录
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        // 检查是否包含 package.json
        const packageJsonPath = path.join(fullPath, 'package.json')
        fs.access(packageJsonPath, fs.constants.F_OK, err => {
          if (!err) {
            console.log(`发现 package.json 在 ${fullPath}`)
            // 执行 npm install 和 npm run build
            exec('npm install && npm run build', { cwd: fullPath }, (error, stdout, stderr) => {
              if (error) {
                console.error(`执行命令失败: ${error}`)
                return
              }
              if (stderr) {
                console.error(`标准错误: ${stderr}`)
              }
              console.log(`标准输出: ${stdout}`)
            })
          } else {
            // 继续递归遍历子目录
            findAndProcessDirectories(fullPath)
          }
        })
      }
    })
  })
}

// 起始目录
const startDir = process.cwd() // 使用当前工作目录
findAndProcessDirectories(startDir)
