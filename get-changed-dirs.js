const { exec } = require('child_process')

// 获取更改的文件夹
function getChangedDirectories(callback) {
  exec('git diff --name-only HEAD^ HEAD', (error, stdout, stderr) => {
    if (error) {
      console.error(`执行命令失败: ${error}`)
      return
    }
    if (stderr) {
      console.error(`标准错误: ${stderr}`)
    }

    // 提取目录路径并去重
    const changedDirs = stdout
      .split('\n')
      .filter(file => file.includes('/'))
      .map(file => file.substring(0, file.lastIndexOf('/')))
      .filter((value, index, self) => self.indexOf(value) === index)

    callback(changedDirs)
  })
}

module.exports = getChangedDirectories
