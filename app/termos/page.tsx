import type { Metadata } from "next";
import LegalLayout from "../_components/legal-layout";

export const metadata: Metadata = {
  title: "Termos de Uso — OneTime",
  description: "Termos e condições de uso da plataforma OneTime.",
};

export default function TermosPage() {
  return (
    <LegalLayout title="Termos de Uso" updated="20 de maio de 2026">
      <p>
        Bem-vindo ao OneTime. Estes Termos de Uso (&ldquo;Termos&rdquo;) regulam o acesso e
        utilização da plataforma OneTime (&ldquo;Plataforma&rdquo; ou &ldquo;Serviço&rdquo;),
        disponibilizada pela OneTime Tecnologia. Ao criar uma conta ou usar o
        Serviço, você declara que leu, compreendeu e concorda com estes Termos.
      </p>

      <h2>1. Aceitação dos Termos</h2>
      <p>
        O cadastro na Plataforma e o uso de qualquer funcionalidade implica
        aceitação integral destes Termos e da Política de Privacidade. Caso
        discorde de qualquer disposição, você não deve utilizar o Serviço.
      </p>

      <h2>2. Cadastro e conta</h2>
      <p>
        Para utilizar o OneTime você deve criar uma conta fornecendo dados
        verídicos, completos e atualizados. Você é responsável pela
        confidencialidade das suas credenciais e por todas as atividades
        realizadas a partir da sua conta.
      </p>
      <ul>
        <li>É proibido criar conta utilizando identidade de terceiros.</li>
        <li>É necessário ter no mínimo 18 anos para se cadastrar.</li>
        <li>Você se compromete a notificar imediatamente qualquer uso não autorizado da sua conta.</li>
      </ul>

      <h2>3. Planos, pagamento e cancelamento</h2>
      <p>
        O OneTime é oferecido em planos pagos mensalmente, com período de teste
        gratuito de 14 dias para novos usuários. Os preços e benefícios de cada
        plano estão descritos na seção de Planos do site.
      </p>
      <ul>
        <li>O pagamento é cobrado mensalmente de forma recorrente no cartão cadastrado.</li>
        <li>Você pode cancelar sua assinatura a qualquer momento, sem multa.</li>
        <li>Cancelamentos cessam a cobrança no próximo ciclo; não há reembolso proporcional de períodos já iniciados.</li>
        <li>Upgrades de plano são aplicados imediatamente; downgrades passam a valer no próximo ciclo.</li>
      </ul>

      <h2>4. Uso aceitável</h2>
      <p>
        Você concorda em utilizar a Plataforma apenas para fins lícitos. É
        expressamente proibido:
      </p>
      <ul>
        <li>Utilizar o Serviço para envio de spam, fraudes ou conteúdos ilegais;</li>
        <li>Tentar acessar dados de outros usuários sem autorização;</li>
        <li>Realizar engenharia reversa, descompilar ou copiar partes substanciais da Plataforma;</li>
        <li>Sobrecarregar a infraestrutura através de scripts, bots ou requisições automatizadas em volume abusivo.</li>
      </ul>

      <h2>5. Integração com WhatsApp (Evolution API)</h2>
      <p>
        O OneTime oferece integração com WhatsApp por meio da Evolution API. As
        credenciais e o número conectado são de inteira responsabilidade do
        usuário. O OneTime não se responsabiliza por bloqueios, suspensões ou
        sanções aplicadas pelo WhatsApp ao número conectado em decorrência do
        uso indevido.
      </p>

      <h2>6. Conteúdo do usuário</h2>
      <p>
        Você mantém todos os direitos sobre os dados que insere na Plataforma
        (clientes, agendamentos, serviços, etc.). Ao usar o Serviço você nos
        concede licença não exclusiva para armazenar, processar e exibir esses
        dados exclusivamente para a operação do Serviço prestado a você.
      </p>

      <h2>7. Disponibilidade do serviço</h2>
      <p>
        Empregamos esforços razoáveis para manter o Serviço disponível 24 horas
        por dia. Eventuais manutenções programadas serão comunicadas com
        antecedência. Não nos responsabilizamos por indisponibilidades causadas
        por terceiros (provedores de hospedagem, redes, falhas do WhatsApp,
        etc.).
      </p>

      <h2>8. Limitação de responsabilidade</h2>
      <p>
        Na máxima extensão permitida pela legislação aplicável, o OneTime não
        responde por danos indiretos, lucros cessantes ou perdas de receita
        decorrentes do uso ou da impossibilidade de uso do Serviço. Em qualquer
        hipótese, a responsabilidade total do OneTime limita-se ao valor pago
        pelo usuário nos 3 (três) meses anteriores ao evento que originou a
        reclamação.
      </p>

      <h2>9. Suspensão e encerramento</h2>
      <p>
        Reservamo-nos o direito de suspender ou encerrar contas que descumpram
        estes Termos, sem prejuízo do direito de cobrar valores devidos. Você
        também pode encerrar sua conta a qualquer momento através do painel
        administrativo.
      </p>

      <h2>10. Propriedade intelectual</h2>
      <p>
        Todo o conteúdo, marcas, logotipos, layouts e o software da Plataforma
        pertencem ao OneTime e são protegidos pelas leis de propriedade
        intelectual. O uso do Serviço não confere ao usuário qualquer direito
        sobre esses ativos.
      </p>

      <h2>11. Alterações nos Termos</h2>
      <p>
        Podemos atualizar estes Termos a qualquer momento. Mudanças relevantes
        serão comunicadas por email e/ou aviso na Plataforma com antecedência
        mínima de 15 dias. O uso continuado após a vigência configura aceitação
        das novas condições.
      </p>

      <h2>12. Legislação aplicável e foro</h2>
      <p>
        Estes Termos são regidos pelas leis da República Federativa do Brasil.
        Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer
        controvérsias, com renúncia a qualquer outro, por mais privilegiado que
        seja.
      </p>
    </LegalLayout>
  );
}
