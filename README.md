# Cable Extrusion Pro

## Calculadora Interativa de DDR/DRB e Insights Técnicos para Extrusão de Cabos

[![Linguagens](https://img.shields.io/badge/Linguagens-HTML%2FCSS%2FJS-blue.svg)](#tecnologias)

🚀 **Sobre o Projeto**

O **Cable Extrusion Pro** é uma aplicação web robusta, projetada para auxiliar engenheiros e técnicos na indústria de extrusão de cabos. A ferramenta oferece cálculos precisos dos índices cruciais:

* **DDR (Draw Down Ratio)**
* **DRB (Die Restriction Balance)**

Além dos cálculos, fornece análises detalhadas e sugestões inteligentes para otimizar os parâmetros do processo de extrusão, resultando em maior eficiência e qualidade do produto final.

✨ **Funcionalidades**

* **🧮 Cálculos Precisos:** Determinação exata de DDR e DRB com base em parâmetros de entrada.
* **📊 Visualização Interativa:** Régua dinâmica para interpretar facilmente os valores de DDR/DRB dentro das faixas recomendadas.
* **💡 Insights Técnicos:** Sugestões contextuais e recomendações ajustadas ao material selecionado.
* **🌐 Suporte Multilíngue:** Interface disponível em Português (🇧🇷) e Inglês (🇺🇸).
* **💾 Persistência Local:** Salvamento e carregamento automático de configurações usando LocalStorage.
* **♿ Acessibilidade:** Tooltips acessíveis via teclado para melhor usabilidade.


🔧 **Como Usar**

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/seu-usuario/seu-repo.git](https://github.com/seu-usuario/seu-repo.git)
    ```

2.  **Abra o `index.html` no navegador:**

    Nenhuma instalação é necessária! A aplicação é executada diretamente no navegador.

🛠️ **Tecnologias**

* **HTML5:** Estrutura da página.
* **CSS3:** Estilização e layout (incluindo CSS Grid e Variáveis CSS para organização e manutenção).
* **JavaScript (Vanilla):** Lógica da aplicação e manipulação do DOM.
* **MathJax:** Renderização de fórmulas matemáticas complexas.
* **LocalStorage API:** Armazenamento local dos dados do usuário.

📈  **Lógica de Cálculo**

As áreas e os índices são calculados usando as seguintes fórmulas:

* **Área da Matriz:**

    ```latex
    A = \pi \left( \frac{d_{\text{matriz}}}{2} \right)^2
    ```

* **Área Final do Cabo:**

    ```latex
    A = \pi \left( \frac{d_{\text{cabo}}}{2} \right)^2
    ```

* **Área de Fluxo:**

    ```latex
    A = \pi \left( \frac{d_{\text{matriz}}}{2} \right)^2 - \pi \left( \frac{d_{\text{guia}}}{2} \right)^2
    ```

* **DDR:**

    ```latex
    DDR = \frac{\text{Área da Matriz}}{\text{Área do Cabo}}
    ```

* **DRB:**

    ```latex
    DRB = \frac{\text{Área da Matriz}}{\text{Área de Fluxo}}
    ```

    Os valores de referência para DDR e DRB são ajustados automaticamente com base no material selecionado (PVC, LSZH, HDPE, PBT), garantindo recomendações precisas.

🔒 **Salvamento de Configurações**

Para conveniência, a aplicação salva automaticamente as últimas configurações inseridas no LocalStorage do navegador. Isso permite que os usuários retomem seus cálculos facilmente em sessões futuras.

👨‍💻 **Para Desenvolvedores**

O código é modular e bem documentado, facilitando a personalização e integração em outros projetos. Aqui estão algumas sugestões de melhorias:

* **Suporte a Mais Polímeros:** Expandir a lista de materiais suportados.
* **Geração de Relatórios:** Implementar a exportação de relatórios em PDF.
* **Integração com Banco de Dados:** Salvar históricos de cálculos para análise.

🤝 **Contribuição**

Sua contribuição é muito bem-vinda! Sinta-se à vontade para abrir Issues para relatar bugs ou sugerir melhorias, ou enviar Pull Requests com suas implementações.
