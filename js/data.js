// ============================================================
//  EDITAR ESTE ARQUIVO PARA ATUALIZAR O CONTEÚDO DA LANDING PAGE
//  Nenhuma outra alteração é necessária — o site se atualiza sozinho.
// ============================================================

const profileData = {
  name: "Matheus Varela Mendes",
  title: "Especialista em Dados | Engenheiro de Analytics",
  location: "Rio de Janeiro, RJ",
  phone: "(21) 96544-1330",
  phoneRaw: "+5521965441330",
  email: "varelamendes1@gmail.com",
  linkedin: "linkedin.com/in/mathvarela",
  linkedinUrl: "https://www.linkedin.com/in/mathvarela/",
  github: "",
  githubUrl: "",

  heroStats: [
    { value: "220+", label: "Relatórios Corporativos" },
    { value: "200%", label: "Redução no Tempo de Carga" },
    { value: "5", label: "Certificações Microsoft" }
  ],

  about: "Especialista em Dados com sólida trajetória na gestão de ecossistemas complexos de Business Intelligence e Engenharia de Dados, sustentada por cinco certificações Microsoft, incluindo DP-700 e PL-300. Atualmente, sou responsável pela governança estratégica do ambiente Microsoft Fabric na Rede D'Or, onde gerencio um portfólio de 220 relatórios corporativos voltados à alta diretoria e vice-presidência. Possuo vasta experiência na implementação de arquitetura de medalhão, otimização de performance em nuvem e automação de processos, acumulando resultados expressivos como redução de 200% no tempo de carga de dados críticos. Sou focado em transformar grandes volumes de dados brutos em ativos estratégicos que impulsionam receita e eficiência operacional.",

  experiences: [
    {
      role: "Especialista em Dados / Engenheiro de Analytics",
      company: "Rede D'Or São Luiz",
      period: "Out 2022 — Presente",
      highlights: [
        "Gerencio governança completa do ambiente Microsoft Fabric, administrando 220 relatórios estratégicos e garantindo escalabilidade do ambiente para evitar throttling.",
        "Implementei arquitetura FUAM para monitoramento de workspaces e consumo de recursos (CUs), permitindo identificar falhas de segurança e otimizar custos operacionais.",
        "Reestruturei 15 dashboards de alta criticidade utilizando Direct Lake, reduzindo o tempo de carga em mais de 200% e aumentando velocidade dos visuais em 80%.",
        "Desenvolvi pipelines de ingestão escaláveis integrando APIs, SQL e Lakehouse, processando volumes que atingem escala de bilhões de linhas.",
        "Automatizei 8 processos críticos de coleta de dados, eliminando o uso de planilhas manuais e garantindo integridade total nas informações enviadas ao banco de dados.",
        "Centralizei indicadores fundamentais de RH, Farmácia e Auditoria em dashboards unificados, facilitando tomada de decisão estratégica por parte de VPs e Diretores.",
        "Atuo como mentor técnico para desenvolvedores juniores, realizando revisões de código e padronizando as melhores práticas de desenvolvimento da equipe."
      ]
    },
    {
      role: "Analista de Dados Pleno",
      company: "YDUQS (Holding Estácio)",
      period: "Jan 2022 — Set 2022",
      highlights: [
        "Desenvolvi dashboards operacionais e financeiros utilizando metodologia Scrum, reduzindo o tempo de resposta às demandas das áreas de negócio.",
        "Estruturei processos de ETL e modelagem de dados complexos para garantir uma fonte única de verdade nos indicadores de desempenho acadêmico.",
        "Automatizei fluxos de atualização no Power BI Service, garantindo disponibilidade de dados em tempo real para gestão."
      ]
    },
    {
      role: "Analista de TI Jr. / Estagiário",
      company: "Sicoob Cecremef",
      period: "Abr 2019 — Jan 2022",
      highlights: [
        "Liderei digitalização de fluxos operacionais da cooperativa, substituindo processos manuais por soluções automatizadas que garantiram maior integridade e rastreabilidade dos dados.",
        "Estruturei infraestrutura de dados inicial para apoiar as análises gerenciais, permitindo que as áreas de negócio tivessem acesso a indicadores de desempenho de forma mais ágil.",
        "Atuei na administração e suporte de sistemas internos e bancos de dados, garantindo alta disponibilidade do ambiente tecnológico para as operações financeiras.",
        "Apoiei migração e o tratamento de dados legados para novos sistemas de gestão, assegurando consistência das informações durante a transição digital.",
        "Desenvolvi automações de rotinas administrativas que reduziram o tempo de processamento de tarefas repetitivas, otimizando o fluxo de trabalho da equipe de TI."
      ]
    }
  ],

  skills: [
    {
      category: "Dados & Cloud",
      items: ["Microsoft Fabric (Lakehouse, Warehouse)", "Azure Data Factory", "Databricks", "Google BigQuery"]
    },
    {
      category: "Linguagens",
      items: ["SQL (PL-SQL, Oracle)", "Python (Pandas, PySpark, SQLAlchemy)", "DAX", "Linguagem M"]
    },
    {
      category: "Visualização & IA",
      items: ["Power BI (Direct Lake)", "Streamlit", "Plotly", "OpenAI API", "LangChain"]
    },
    {
      category: "Engenharia & Governança",
      items: ["Arquitetura de Medalhão", "CI/CD", "Monitoramento de CUs (Capacity Units)", "RLS", "Criptografia"]
    }
  ],

  education: [
    {
      degree: "Pós-Graduação em Análise de Dados",
      institution: "FACIT",
      year: "Conclusão: Out/2025"
    },
    {
      degree: "Graduação em Redes de Computadores",
      institution: "",
      year: ""
    }
  ],

  certifications: [
    { code: "DP-700", name: "Fabric Data Engineer" },
    { code: "PL-300", name: "Power BI Data Analyst" },
    { code: "AZ-900", name: "Azure Fundamentals" },
    { code: "DP-900", name: "Azure Data Fundamentals" },
    { code: "PL-900", name: "Power Platform Fundamentals" }
  ]
};