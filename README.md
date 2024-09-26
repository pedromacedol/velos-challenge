# Instruções Case Estágio - Vélos

## Descrição do Projeto

Este projeto tem como objetivo desenvolver uma interface web simples onde o usuário pode fazer o upload de um PDF contendo a transcrição de uma call de vendas. A aplicação utiliza IA para analisar o desempenho do vendedor e fornecer um feedback com base na transcrição. O feedback gerado inclui uma nota de 0 a 10, pontos positivos, pontos negativos e sugestões de melhorias para a performance do vendedor.

## Funcionalidades

- Upload de arquivos PDF contendo a transcrição de calls de vendas.
- Geração de feedback automatizado utilizando IA.
- O feedback é estruturado em quatro categorias:
  - **Nota**: Avaliação de 0 a 10 sobre a performance do vendedor.
  - **Pontos Positivos**: Destaques positivos do desempenho do vendedor.
  - **Pontos Negativos**: Áreas onde o vendedor pode melhorar.
  - **Sugestões de Melhoria**: Recomendações para aprimorar a performance nas próximas interações.

## Tecnologias Utilizadas

- **Frontend**: React para upload de PDF.
- **Backend**: NestJS para manipulação de arquivos e processamento.
- **IA**: OpenAI GPT-4o-mini para análise e geração de feedback.
- **Armazenamento**: AWS S3 para armazenar os arquivos PDF.
- **Banco de Dados**: DynamoDB para registrar e acompanhar as transcrições e feedbacks.
