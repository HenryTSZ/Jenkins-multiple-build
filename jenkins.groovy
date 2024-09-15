pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // 从 Git 仓库拉取最新的代码
                git url: 'https://your-repo-url.git', branch: 'main'
            }
        }
        stage('Identify Changed Directories') {
            steps {
                script {
                    // 获取最近一次提交的哈希
                    def commitHash = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()

                    // 获取前一个提交的哈希
                    def previousCommitHash = sh(script: 'git rev-parse HEAD~1', returnStdout: true).trim()

                    // 获取更改的文件
                    def changedFiles = sh(script: "git diff --name-only ${previousCommitHash} ${commitHash}", returnStdout: true).trim().split('\n')

                    // 获取所有更改的目录
                    def changedDirs = changedFiles.collect { file ->
                        file.tokenize('/')[0..-2].join('/')
                    }.unique()

                    echo "Changed directories:"
                    echo changedDirs.join('\n')

                    // 函数：检查目录及其父目录是否包含 package.json
                    def findPackageJsonDir = { dir ->
                        def currentDir = dir
                        while (currentDir != '') {
                            if (fileExists("${currentDir}/package.json")) {
                                return currentDir
                            }
                            def parentDir = currentDir.tokenize('/')[0..-2].join('/')
                            if (parentDir == '') {
                                break
                            }
                            currentDir = parentDir
                        }
                        return null
                    }

                    // 追踪已处理的目录
                    def processedDirs = []

                    // 在更改的文件夹中执行构建
                    changedDirs.each { changedDir ->
                        def buildDir = findPackageJsonDir(changedDir)
                        if (buildDir != null && !processedDirs.contains(buildDir)) {
                            echo "Found package.json in ${buildDir}, running npm install and build"
                            dir(buildDir) {
                                sh 'npm install'
                                sh 'npm run build'
                            }
                            processedDirs.add(buildDir) // 标记为已处理
                        } else {
                            echo "No package.json found in ${changedDir} or it has already been processed"
                        }
                    }
                }
            }
        }
    }
}
