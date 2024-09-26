import { InboxOutlined } from "@ant-design/icons";
import { Button, message, Upload, UploadProps } from "antd";
import axios from "axios";
import { useState } from "react";
import "./App.css";
import VelosLogo from "./assets/velos.svg";
const { Dragger } = Upload;

function App() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [uploadResponse, setUploadResponse] = useState<any>(null);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setIsUploaded(false);
    setUploadResponse(null); 

    try {
     
      const response = await axios.post(
        process.env.VITE_APP_API_URL,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success(`${file.name} enviado com sucesso!`);
      console.log("Resposta do servidor:", response.data);
      setUploadResponse(response.data); 
      setIsUploaded(true);
    } catch (error) {
      message.error(`Falha ao enviar o arquivo ${file.name}.`);
      console.error("Erro ao enviar o arquivo:", error);
    } finally {
      setUploading(false);
    }
  };


  const resetUpload = () => {
    setIsUploaded(false);
    setUploadResponse(null);
  };

  const props: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      if (uploading) {
        message.warning("Por favor, aguarde o upload ser concluído.");
        return false;
      }

      uploadFile(file);
      return false;
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div>
      {uploading && (
        <div className="svg-container">
          <img
            className="rotating-logo"
            src={VelosLogo}
            width="100"
            height="100"
            alt="Loading..."
          />
        </div>
      )}

      {!uploading && !isUploaded && (
        <div className="card-upload">
          <div style={{ color: "black" }}> Análise de Chamada</div>
          <Dragger
            maxCount={1}
            style={{ maxHeight: "85%", marginTop: "0.75rem" }}
            {...props}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Solte o arquivo aqui ou clique para fazer upload
            </p>
            <p className="ant-upload-hint">
              Apenas um arquivo pode ser carregado por vez. Certifique-se de que
              o arquivo não contenha informações proibidas ou dados
              confidenciais.
            </p>
          </Dragger>
        </div>
      )}

      {isUploaded && uploadResponse && (
        <div className="feedback-container">
          <h3>Resultado da Avaliação</h3>
          <p>
            <strong>Nota: </strong>
            {uploadResponse.score}
          </p>
          <h4>Feedback</h4>
          <p>
            <strong>Positivo: </strong>
            {uploadResponse.feedback.positivo}
          </p>
          <p>
            <strong>Negativo: </strong>
            {uploadResponse.feedback.negativo}
          </p>
          <h4>Métricas</h4>
          <p>
            <strong>Duração da Ligação: </strong>
            {uploadResponse.metricas.duracaoDaLigacao}
          </p>
          <p>
            <strong>Palavras por Minuto: </strong>
            {uploadResponse.metricas.palavrasPorMinuto}
          </p>
          <p>
            <strong>Tempo Falando: </strong>
            {uploadResponse.metricas.tempoFalando}
          </p>
          <p>
            <strong>Tempo Ouvindo: </strong>
            {uploadResponse.metricas.tempoOuvindo}
          </p>
          <h4>Sugestões</h4>
          <p>{uploadResponse.sugestões}</p>

          <Button
            type="primary"
            onClick={resetUpload}
            style={{ marginTop: "10px" }}
          >
            Enviar outro arquivo
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
