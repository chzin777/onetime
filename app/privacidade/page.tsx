import type { Metadata } from "next";
import LegalLayout from "../_components/legal-layout";

export const metadata: Metadata = {
  title: "Política de Privacidade — OneTime",
  description: "Como o OneTime coleta, usa e protege seus dados pessoais.",
};

export default function PrivacidadePage() {
  return (
    <LegalLayout title="Política de Privacidade" updated="20 de maio de 2026">
      <p>
        Esta Política descreve como o OneTime coleta, usa, compartilha e
        protege os dados pessoais dos usuários da Plataforma, em conformidade
        com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD).
      </p>

      <h2>1. Controlador dos dados</h2>
      <p>
        O OneTime Tecnologia atua como Controlador dos dados pessoais dos seus
        usuários (donos de estabelecimento) e como Operador dos dados pessoais
        dos clientes finais cadastrados no painel pelo titular da conta.
      </p>

      <h2>2. Dados que coletamos</h2>
      <h3>2.1 Dados de cadastro do usuário</h3>
      <ul>
        <li>Nome completo, email, telefone, cargo;</li>
        <li>Dados de pagamento (processados por gateway de pagamento parceiro, jamais armazenamos o número do cartão);</li>
        <li>Dados do estabelecimento (razão social, CNPJ, endereço).</li>
      </ul>

      <h3>2.2 Dados dos clientes finais</h3>
      <ul>
        <li>Nome e telefone informados no momento do agendamento;</li>
        <li>Histórico de serviços contratados e horários agendados.</li>
      </ul>

      <h3>2.3 Dados técnicos</h3>
      <ul>
        <li>Endereço IP, tipo de navegador, sistema operacional;</li>
        <li>Logs de acesso e ações realizadas na Plataforma;</li>
        <li>Cookies essenciais à autenticação e funcionamento do Serviço.</li>
      </ul>

      <h2>3. Para que usamos seus dados</h2>
      <ul>
        <li>Operacionalizar o Serviço contratado (criar conta, processar agendamentos, enviar mensagens via WhatsApp);</li>
        <li>Cobrança e gestão da assinatura;</li>
        <li>Suporte técnico e atendimento ao usuário;</li>
        <li>Comunicações transacionais (confirmações, lembretes, alertas de segurança);</li>
        <li>Comunicações de marketing — somente mediante consentimento prévio, podendo ser revogado a qualquer momento;</li>
        <li>Cumprimento de obrigações legais e regulatórias;</li>
        <li>Prevenção de fraudes e abusos.</li>
      </ul>

      <h2>4. Base legal do tratamento</h2>
      <p>
        O tratamento dos dados é fundamentado nas seguintes bases legais da LGPD:
        execução de contrato (art. 7º, V), cumprimento de obrigação legal
        (art. 7º, II), legítimo interesse (art. 7º, IX) e, quando aplicável,
        consentimento (art. 7º, I).
      </p>

      <h2>5. Compartilhamento de dados</h2>
      <p>
        Os seus dados podem ser compartilhados com:
      </p>
      <ul>
        <li>Provedores de infraestrutura em nuvem que hospedam a Plataforma;</li>
        <li>Gateways de pagamento para processamento da assinatura;</li>
        <li>Provedores da Evolution API ou outras integrações ativadas por você;</li>
        <li>Autoridades públicas, quando legalmente exigido.</li>
      </ul>
      <p>
        Nunca vendemos dados pessoais a terceiros.
      </p>

      <h2>6. Armazenamento e segurança</h2>
      <p>
        Os dados são armazenados em servidores localizados no Brasil ou em
        países com nível de proteção adequado, com criptografia em trânsito
        (TLS 1.2+) e em repouso. Aplicamos controles de acesso, monitoramento
        contínuo e backups regulares. Apesar dos esforços, nenhum sistema é
        100% imune; em caso de incidente relevante, comunicaremos os titulares
        afetados e a ANPD nos prazos exigidos pela LGPD.
      </p>

      <h2>7. Retenção dos dados</h2>
      <p>
        Mantemos os dados pelo tempo necessário ao cumprimento das finalidades
        descritas ou pelo prazo exigido por lei. Após o encerramento da conta,
        os dados são anonimizados ou excluídos em até 90 dias, salvo
        obrigações legais de guarda (ex: dados fiscais por 5 anos).
      </p>

      <h2>8. Seus direitos como titular</h2>
      <p>
        Em conformidade com a LGPD, você pode a qualquer momento:
      </p>
      <ul>
        <li>Confirmar a existência de tratamento dos seus dados;</li>
        <li>Acessar seus dados e solicitar cópia;</li>
        <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
        <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários;</li>
        <li>Solicitar a portabilidade dos dados;</li>
        <li>Revogar o consentimento e opor-se a tratamentos baseados nele;</li>
        <li>Apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).</li>
      </ul>
      <p>
        Para exercer qualquer desses direitos, envie um email para{" "}
        <a href="mailto:privacidade@onetime.app">privacidade@onetime.app</a>.
      </p>

      <h2>9. Cookies</h2>
      <p>
        Utilizamos cookies essenciais para manter você autenticado e
        funcionalidades básicas. Cookies analíticos e de marketing são
        utilizados apenas mediante consentimento. Você pode gerenciar
        preferências de cookies a qualquer momento pelo banner na primeira
        visita ou pelas configurações do navegador.
      </p>

      <h2>10. Crianças e adolescentes</h2>
      <p>
        O OneTime não é direcionado a menores de 18 anos. Não coletamos
        intencionalmente dados de menores. Se identificarmos dados de menores
        de idade, eles serão prontamente excluídos.
      </p>

      <h2>11. Encarregado de Proteção de Dados (DPO)</h2>
      <p>
        Para questões específicas de privacidade e proteção de dados, contate
        nosso DPO em{" "}
        <a href="mailto:dpo@onetime.app">dpo@onetime.app</a>.
      </p>

      <h2>12. Alterações nesta Política</h2>
      <p>
        Esta Política pode ser atualizada periodicamente. Alterações
        significativas serão comunicadas por email e/ou aviso na Plataforma. A
        versão vigente estará sempre disponível neste endereço.
      </p>
    </LegalLayout>
  );
}
