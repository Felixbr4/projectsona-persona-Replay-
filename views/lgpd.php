<?php
/**
 * Persona Replay - Termos de Privacidade e Proteção de Dados (LGPD)
 * Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)
 */

$pageTitle = "Termos da LGPD & Privacidade";
$activeNav = "";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px; max-width: 960px;">
    <!-- Breadcrumb -->
    <div style="font-size: 13px; color: var(--theme-muted); margin-bottom: 24px;">
        <a href="<?= url('/') ?>">Início</a>
        <span>/</span>
        <span style="color: #fff;">LGPD & Proteção de Dados</span>
    </div>

    <!-- Header -->
    <div class="card" style="padding: 40px; margin-bottom: 36px; border-left: 6px solid var(--theme-primary);">
        <span class="badge badge-primary" style="margin-bottom: 8px;">Conformidade Legal</span>
        <h1 class="font-display" style="font-size: 34px; font-weight: 900; text-transform: uppercase; margin-bottom: 12px;">
            Termos da LGPD & Política de Privacidade
        </h1>
        <p style="color: var(--theme-muted); font-size: 15px; line-height: 1.6;">
            A <strong>Persona Replay</strong> está 100% comprometida com a transparência, segurança e privacidade dos dados dos usuários, em estrita observância à Lei Geral de Proteção de Dados Pessoais (<strong>Lei Federal nº 13.709/2018 — LGPD</strong>).
        </p>
    </div>

    <!-- Content Sections -->
    <div style="display: flex; flex-direction: column; gap: 28px;">
        <!-- Section 1 -->
        <div class="card" style="padding: 32px;">
            <h2 class="font-display" style="font-size: 20px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px; color: var(--theme-primary);">
                1. Princípios Gerais do Tratamento de Dados
            </h2>
            <p style="color: var(--theme-muted); font-size: 14px; line-height: 1.8; margin-bottom: 16px;">
                Em cumprimento ao Artigo 6º da LGPD, todas as atividades de tratamento de dados pessoais realizadas pela plataforma Persona Replay obedecem aos seguintes princípios fundamentais:
            </p>
            <ul style="padding-left: 20px; color: var(--theme-muted); font-size: 14px; line-height: 1.8;">
                <li><strong>Finalidade:</strong> Coleta exclusiva de dados para propósitos legítimos, específicos e informados ao titular (criação de conta, processamento de pedidos e emissão de chaves Steam).</li>
                <li><strong>Adequação:</strong> Compatibilidade do tratamento com as finalidades previamente informadas.</li>
                <li><strong>Necessidade (Minimização):</strong> Coleta apenas dos dados estritamente indispensáveis para a conclusão das compras e segurança transacional.</li>
                <li><strong>Livre Acesso:</strong> Garantia aos usuários de consulta facilitada e gratuita sobre a forma e duração do tratamento de seus dados.</li>
                <li><strong>Qualidade dos Dados:</strong> Garantia de exatidão, clareza e atualização dos dados cadastrados.</li>
                <li><strong>Transparência:</strong> Informações claras, precisas e facilmente acessíveis sobre os critérios de tratamento.</li>
                <li><strong>Segurança:</strong> Utilização de medidas técnicas (criptografia AES-256 e hashing BCRYPT) para proteção contra acessos não autorizados.</li>
                <li><strong>Prevenção:</strong> Adoção de salvaguardas para evitar a ocorrência de danos em virtude do tratamento de dados.</li>
                <li><strong>Não Discriminação:</strong> Impossibilidade de realização de tratamento para fins discriminatórios, ilícitos ou abusivos.</li>
                <li><strong>Responsabilização e Prestação de Contas:</strong> Demonstração eficaz da observância e cumprimento de todas as normas de proteção de dados.</li>
            </ul>
        </div>

        <!-- Section 2 -->
        <div class="card" style="padding: 32px;">
            <h2 class="font-display" style="font-size: 20px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px; color: var(--theme-primary);">
                2. Quais Dados Coletamos e Para Quais Finalidades
            </h2>
            <div class="table-responsive">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Dado Pessoal</th>
                            <th>Base Legal (Art. 7º LGPD)</th>
                            <th>Finalidade Específica</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Nome Completo</strong></td>
                            <td>Execução de Contrato</td>
                            <td>Identificação do titular e personalização da conta e dos comprovantes de pedido.</td>
                        </tr>
                        <tr>
                            <td><strong>E-mail</strong></td>
                            <td>Execução de Contrato</td>
                            <td>Autenticação, envio do recibo da compra e notificações de liberação de chaves Steam.</td>
                        </tr>
                        <tr>
                            <td><strong>Senha Criptografada (Hash)</strong></td>
                            <td>Segurança / Legítimo Interesse</td>
                            <td>Armazenada unicamente sob hash criptográfico irreversível (BCRYPT custo 12) para login seguro.</td>
                        </tr>
                        <tr>
                            <td><strong>Histórico de Pedidos & Chaves</strong></td>
                            <td>Cumprimento de Obrigação Legal</td>
                            <td>Manutenção de registros fiscais e exibição das chaves de ativação ao usuário logado.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Section 3 -->
        <div class="card" style="padding: 32px;">
            <h2 class="font-display" style="font-size: 20px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px; color: var(--theme-primary);">
                3. Segurança da Informação e Criptografia Militar
            </h2>
            <p style="color: var(--theme-muted); font-size: 14px; line-height: 1.8; margin-bottom: 14px;">
                A Persona Replay adota as melhores práticas de cibersegurança do mercado global:
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div style="background: var(--theme-surface); border: 1px solid var(--theme-border); border-radius: 12px; padding: 18px;">
                    <strong style="color: #fff; display: block; margin-bottom: 6px;"><i class="fa-solid fa-lock" style="color: var(--theme-primary);"></i> Criptografia AES-256-CBC</strong>
                    <span style="font-size: 13px; color: var(--theme-muted);">Todas as chaves digitais de ativação são criptografadas no banco de dados e apenas descriptografadas em memória quando o próprio comprador as acessa.</span>
                </div>
                <div style="background: var(--theme-surface); border: 1px solid var(--theme-border); border-radius: 12px; padding: 18px;">
                    <strong style="color: #fff; display: block; margin-bottom: 6px;"><i class="fa-solid fa-shield-halved" style="color: #10b981;"></i> Proteção contra CSRF & SQL Injection</strong>
                    <span style="font-size: 13px; color: var(--theme-muted);">Todas as conexões utilizam consultas preparadas (PDO Prepared Statements) e tokens CSRF em todas as operações de mutação.</span>
                </div>
            </div>
        </div>

        <!-- Section 4 -->
        <div class="card" style="padding: 32px;">
            <h2 class="font-display" style="font-size: 20px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px; color: var(--theme-primary);">
                4. Direitos do Titular dos Dados (Artigo 18 da LGPD)
            </h2>
            <p style="color: var(--theme-muted); font-size: 14px; line-height: 1.8; margin-bottom: 16px;">
                Você, como titular de dados pessoais, tem o direito de obter da Persona Replay, a qualquer momento e mediante requisição simples:
            </p>
            <ol style="padding-left: 20px; color: var(--theme-muted); font-size: 14px; line-height: 1.8;">
                <li>Confirmação da existência de tratamento dos seus dados;</li>
                <li>Acesso aos dados coletados no seu painel da conta;</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade;</li>
                <li>Portabilidade dos dados a outro fornecedor de serviço;</li>
                <li>Eliminação dos dados pessoais tratados com o seu consentimento;</li>
                <li>Informação sobre as entidades públicas e privadas com as quais realizamos uso compartilhado;</li>
                <li>Revogação do consentimento nos termos da lei.</li>
            </ol>
        </div>

        <!-- Section 5 -->
        <div class="card" style="padding: 32px;">
            <h2 class="font-display" style="font-size: 20px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px; color: var(--theme-primary);">
                5. Contato do Encarregado de Proteção de Dados (DPO)
            </h2>
            <p style="color: var(--theme-muted); font-size: 14px; line-height: 1.8; margin-bottom: 16px;">
                Para exercer quaisquer dos seus direitos ou esclarecer dúvidas sobre os termos de proteção de dados, entre em contato com nosso Encarregado (DPO):
            </p>
            <div style="background: var(--theme-surface); border: 1px solid var(--theme-border); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px;">
                <div style="font-size: 32px; color: var(--theme-primary);"><i class="fa-solid fa-envelope-circle-check"></i></div>
                <div>
                    <strong style="color: #fff; font-size: 15px;">Canal de Atendimento LGPD / DPO</strong>
                    <div style="font-size: 13px; color: var(--theme-muted);">E-mail: <code>privacidade@personareplay.com</code> ou <code>dpo@personareplay.com</code></div>
                    <div style="font-size: 12px; color: var(--theme-primary); margin-top: 4px;">Prazo de resposta: Até 48 horas úteis.</div>
                </div>
            </div>
        </div>

        <!-- Section 6 -->
        <div class="card" style="padding: 32px;">
            <h2 class="font-display" style="font-size: 20px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px; color: var(--theme-primary);">
                6. Política de Cookies & Gestão de Consentimento
            </h2>
            <p style="color: var(--theme-muted); font-size: 14px; line-height: 1.8; margin-bottom: 16px;">
                Em total transparência com o Artigo 9º da LGPD, os cookies utilizados pela plataforma são classificados nas seguintes categorias:
            </p>
            <ul style="padding-left: 20px; color: var(--theme-muted); font-size: 14px; line-height: 1.8; margin-bottom: 24px;">
                <li><strong>Cookies Estritamente Necessários:</strong> Fundamentais para autenticação, controle de sessões, integridade do carrinho e segurança das chaves Steam (AES-256). Sempre ativos.</li>
                <li><strong>Cookies de Preferências & Temas:</strong> Armazenam sua personalização visual (Persona 3, 4, 5 ou Velvet Room). Opcionais.</li>
                <li><strong>Cookies Analíticos:</strong> Coletam métricas anônimas de tráfego e latência para aprimoramento da performance. Opcionais.</li>
                <li><strong>Cookies de Marketing:</strong> Relevância em comparativos de preços e alertas promocionais. Opcionais.</li>
            </ul>
            <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                <button type="button" class="btn btn-primary" data-open-cookie-modal>
                    <i class="fa-solid fa-sliders"></i> Gerenciar Preferências de Cookies
                </button>
                <span style="font-size: 13px; color: var(--theme-muted);">Você pode alterar ou revogar seu consentimento a qualquer momento.</span>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
