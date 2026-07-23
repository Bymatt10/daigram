// Jenkinsfile — build de la imagen Docker de daigram y deploy en el propio host.
// Requisitos del agente: Docker CLI disponible (label "docker" o ajusta el agent).
//
// La clave de MiniMax es OPCIONAL y va vacía por defecto: la app funciona sin ella
// y cada usuario puede escribir su propia clave en el modal de IA (se guarda en su
// navegador). Si la pones aquí, ojo: es PUBLIC_* y queda incrustada en el JS del
// bundle, visible para cualquiera que abra el sitio.

pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '15'))
  }

  parameters {
    password(
      name: 'PUBLIC_MINIMAX_KEY',
      defaultValue: '',
      description: 'Clave de MiniMax para el generador IA. Déjala VACÍA para que cada usuario ponga la suya en la app.'
    )
    string(
      name: 'DOCKER_NETWORK',
      defaultValue: 'npm',
      description: 'Red de Docker donde vive Nginx Proxy Manager. En NPM apunta el proxy host a http://daigram:80. Déjalo vacío para publicar el puerto HOST_PORT en su lugar.'
    )
    string(
      name: 'HOST_PORT',
      defaultValue: '8080',
      description: 'Solo se usa si DOCKER_NETWORK está vacío: puerto del host donde se expone el sitio.'
    )
  }

  environment {
    IMAGE          = 'daigram'
    CONTAINER_NAME = 'daigram'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        script {
          def shortCommit = sh(script: 'git rev-parse --short HEAD || echo local', returnStdout: true).trim()
          env.TAG = "${env.BUILD_NUMBER}-${shortCommit}"
        }
      }
    }

    stage('Build imagen') {
      steps {
        sh """
          DOCKER_BUILDKIT=1 docker build \\
            --build-arg PUBLIC_MINIMAX_KEY='${params.PUBLIC_MINIMAX_KEY}' \\
            -t ${IMAGE}:${TAG} \\
            -t ${IMAGE}:latest \\
            .
        """
      }
    }

    stage('Smoke test') {
      steps {
        // Levanta la imagen en un puerto efímero y comprueba que nginx responde.
        sh '''
          docker rm -f daigram-smoke >/dev/null 2>&1 || true
          docker run -d --name daigram-smoke -p 127.0.0.1:0:80 ${IMAGE}:${TAG}
          PORT=$(docker port daigram-smoke 80/tcp | head -n1 | awk -F: '{print $NF}')
          for i in $(seq 1 10); do
            if curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null; then break; fi
            sleep 1
            [ "$i" = 10 ] && { echo "El contenedor no respondió"; exit 1; }
          done
          curl -fsS "http://127.0.0.1:${PORT}/" | grep -qi daigram
        '''
      }
      post {
        always {
          sh 'docker rm -f daigram-smoke >/dev/null 2>&1 || true'
        }
      }
    }

    // Para publicar en un registry, descomenta y configura la credencial "docker-registry":
    // stage('Push') {
    //   steps {
    //     withCredentials([usernamePassword(credentialsId: 'docker-registry', usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
    //       sh '''
    //         echo "$REG_PASS" | docker login registry.example.com -u "$REG_USER" --password-stdin
    //         docker tag ${IMAGE}:${TAG} registry.example.com/${IMAGE}:${TAG}
    //         docker push registry.example.com/${IMAGE}:${TAG}
    //       '''
    //     }
    //   }
    // }

    stage('Deploy') {
      steps {
        script {
          // Con red: NPM llega al contenedor por su nombre (http://daigram:80),
          // sin exponer ningún puerto en el host. Sin red: puerto clásico.
          def wiring = params.DOCKER_NETWORK?.trim()
            ? "--network ${params.DOCKER_NETWORK.trim()}"
            : "-p ${params.HOST_PORT}:80"
          sh """
            docker rm -f ${CONTAINER_NAME} >/dev/null 2>&1 || true
            docker run -d \\
              --name ${CONTAINER_NAME} \\
              --restart unless-stopped \\
              ${wiring} \\
              ${IMAGE}:${TAG}
          """
        }
      }
    }
  }

  post {
    success {
      script {
        if (params.DOCKER_NETWORK?.trim()) {
          echo "daigram desplegado en la red '${params.DOCKER_NETWORK}' (imagen ${IMAGE}:${TAG}). En NPM: proxy host → http://${CONTAINER_NAME}:80"
        } else {
          echo "daigram desplegado: http://<host>:${params.HOST_PORT} (imagen ${IMAGE}:${TAG})"
        }
      }
    }
    always {
      // Limpia imágenes viejas sin tocar la desplegada
      sh 'docker image prune -f >/dev/null 2>&1 || true'
    }
  }
}
