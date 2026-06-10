import React, { useState, useRef, useCallback, DragEvent, ChangeEvent } from "react";
import { useNavigate } from 'react-router-dom'
import "./UploadImagem.css";

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface FilePreview {
  name: string;
  sizeMb: string;
  dataUrl: string;
}

const ImageUpload: React.FC = () => {
  const [preview, setPreview] = useState<FilePreview | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate()

  const processFile = useCallback((file: File | null | undefined) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) return;
    if (file.size / 1024 / 1024 > MAX_SIZE_MB) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview({
        name: file.name,
        sizeMb: (file.size / 1024 / 1024).toFixed(1),
        dataUrl: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const resetUpload = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="upload-page">
      <header>
        <div className="header-left">
          <img src="/assets/icone.png" alt="ícone" width={32} height={32} style={{ objectFit: 'contain' }} />
          <div className="logo">Quebrando a Cabeça</div>
        </div>
        <button className="back-button" onClick={() => navigate('/selecao-nivel')}>
          ← Voltar
        </button>
      </header>

      <main>
        <div className="upload-title">Envie sua imagem</div>
        <div className="upload-sub">Formatos aceitos: JPG, PNG, WEBP · Máx. 10 MB</div>

        {!preview && (
          <div
            className={`upload-zone${dragging ? " dragover" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-icon">☁️</div>
            <p>Arraste ou clique para selecionar</p>
            <span>Máx. 10 MB</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="iu-file-input"
          onChange={handleFileChange}
        />

        {preview && (
          <div className="iu-preview">
            <div
              className="preview-img"
              style={{
                backgroundImage: `url(${preview.dataUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="file-info">{preview.name} — {preview.sizeMb} MB</div>
            <button
              className="iu-btn btn-primary"
              onClick={() => navigate('/selecao-dificuldade')}
            >
              Confirmar e continuar →
            </button>
            <button className="iu-link" onClick={resetUpload}>
              Trocar imagem
            </button>
          </div>
        )}

        {!preview && (
          <div className="button-wrapper">
            <button className="iu-btn btn-primary" disabled>
              Confirmar e continuar
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ImageUpload;