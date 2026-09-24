import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

const DIGITAL_KEY_SECRET = process.env.DIGITAL_KEY_SECRET || "default-secret-persona-key-32b-pad!!";
const ENCRYPTION_KEY = crypto.createHash("sha256").update(DIGITAL_KEY_SECRET).digest();
const IV_LENGTH = 16;

function encryptKey(plainKey: string): { encrypted: string; hash: string } {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(plainKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  const fullEncrypted = `${iv.toString("hex")}:${encrypted}`;
  const hash = crypto.createHash("sha256").update(plainKey).digest("hex");
  return { encrypted: fullEncrypted, hash };
}

async function main() {
  console.log("🌟 Iniciando Seed do ProjecSona...");

  // 1. Limpar dados anteriores de forma ordenada
  await prisma.digitalKey.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.externalOffer.deleteMany();
  await prisma.externalStore.deleteMany();
  await prisma.product.deleteMany();
  await prisma.character.deleteMany();
  await prisma.game.deleteMany();
  await prisma.emailVerificationToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();

  // 2. Criar Usuários (Admin e Cliente Demo)
  const adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "adminpassword123", 12);
  const userPasswordHash = await bcrypt.hash("userpassword123", 12);

  const adminUser = await prisma.user.create({
    data: {
      name: process.env.ADMIN_NAME || "Igor Velvet Master",
      email: process.env.ADMIN_EMAIL || "admin@projecsona.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: new Date(),
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "Ren Amamiya (Joker)",
      email: "ren.amamiya@projecsona.com",
      passwordHash: userPasswordHash,
      role: "USER",
      status: "ACTIVE",
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Usuários criados: Admin (${adminUser.email}) e Usuário Demo (${demoUser.email})`);

  // 3. Criar os 3 Jogos Temáticos
  const p3 = await prisma.game.create({
    data: {
      name: "Persona 3 Reload",
      slug: "persona-3-reload",
      theme: "persona3",
      genre: "JRPG / Dungeon Crawler Noturno",
      developer: "ATLUS / P-Studio",
      releaseDate: "02 de Fevereiro de 2024",
      metacriticScore: 89,
      description: "Mergulhe na Dark Hour e desperte as profundezas do seu coração. O remake definitivo do aclamado RPG que revolucionou a franquia com visuais em Unreal Engine e trilha sonora regravada.",
      story: "Se eu disser que existe uma hora escondida entre um dia e o próximo... você acreditaria? Ao se transferir para a Gekkoukan High School, o protagonista descobre a 'Dark Hour', um período sobrenatural à meia-noite onde as pessoas se transformam em caixões e sombras emergem de uma colossal torre chamada Tártaro. Ao despertar sua Persona com um Evoker, ele se junta ao SEES (Specialized Extracurricular Execution Squad) para desvendar o mistério e desafiar o próprio destino.",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
      bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    },
  });

  const p4 = await prisma.game.create({
    data: {
      name: "Persona 4 Revival",
      slug: "persona-4-revival",
      theme: "persona4",
      genre: "JRPG / Investigação / Sobrenatural",
      developer: "ATLUS / P-Studio",
      releaseDate: "13 de Novembro de 2024",
      metacriticScore: 93,
      description: "Sintonize no Midnight Channel e encare sua verdadeira face. Uma narrativa eletrizante de assassinato em série numa pacata cidade rural envolta por neblina misteriosa.",
      story: "Uma pacata cidade rural do interior do Japão chamada Inaba é abalada por uma série de assassinatos bizarros que ocorrem sempre em noites chuvosas de neblina densa. Um rumor urbano diz que olhar para uma televisão desligada à meia-noite durante a chuva revela sua alma gêmea no lendário 'Midnight Channel'. Ao investigar, o protagonista e seus amigos descobrem que o canal é a entrada para um mundo distorcido dentro da TV, onde precisam enfrentar suas próprias Sombras interiores e salvar vítimas antes que a neblina se espalhe.",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop",
      bannerImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop",
    },
  });

  const p5 = await prisma.game.create({
    data: {
      name: "Persona 5 Royal",
      slug: "persona-5-royal",
      theme: "persona5",
      genre: "JRPG / Stylized Heist / Ação",
      developer: "ATLUS / P-Studio",
      releaseDate: "21 de Outubro de 2022",
      metacriticScore: 95,
      description: "Coloque sua máscara, roube os desejos corrompidos e liberte o mundo. A experiência definitiva dos Phantom Thieves repleta de estilo, jazz dinâmico e atitude rebelde.",
      story: "Forçado a se transferir para a Shujin Academy em Tóquio após ser injustamente condenado, o protagonista descobre um aplicativo misterioso em seu smartphone chamado Metaverse Navigator. Ele desperta o poder de sua Persona e funda os 'Phantom Thieves of Hearts' (Ladrões Fantasmas de Copas). Usando máscaras e trajes rebeldes, o grupo invade os 'Palácios' — projeções cognitivas distorcidas dos desejos corrompidos de adultos abusivos — para roubar seus 'Tesouros' e forçar confissões de seus crimes.",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop",
      bannerImage: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1600&auto=format&fit=crop",
    },
  });

  console.log("✅ 3 Jogos Temáticos criados!");

  // 4. Criar Personagens
  const characters = [
    // P3
    {
      gameId: p3.id,
      name: "Makoto Yuki",
      roleTag: "Protagonista / Líder do SEES",
      personaName: "Orpheus & Thanatos",
      arcana: "0 - O Louco (The Fool)",
      description: "Estudante transferido do terceiro ano que desperta a habilidade de empunhar múltiplas Personas durante a Dark Hour.",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop",
    },
    {
      gameId: p3.id,
      name: "Yukari Takeba",
      roleTag: "Membro do SEES / Arqueira",
      personaName: "Io / Isis",
      arcana: "VI - Os Enamorados (The Lovers)",
      description: "Colega de classe popular e determinada que busca a verdade sobre a morte de seu pai e as origens da Dark Hour.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    },
    {
      gameId: p3.id,
      name: "Aigis",
      roleTag: "Arma Anti-Sombra de 7ª Geração",
      personaName: "Palladion / Athena",
      arcana: "VII - A Carruagem / O Carro",
      description: "Cyborg humanoide criada pelo Kirijo Group com o propósito primordial de exterminar Sombras e proteger o protagonista.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    },

    // P4
    {
      gameId: p4.id,
      name: "Yu Narukami",
      roleTag: "Protagonista / Líder da Equipe",
      personaName: "Izanagi & Izanagi-no-Okami",
      arcana: "0 - O Louco (The Fool)",
      description: "Líder calmo e carismático que se muda para Inaba e lidera a investigação dos assassinatos no TV World.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    },
    {
      gameId: p4.id,
      name: "Chie Satonaka",
      roleTag: "Investigadora / Especialista em Kung Fu",
      personaName: "Tomoe / Suzuka Gongen",
      arcana: "VIII - A Justiça / A Força",
      description: "Apaixonada por artes marciais e bife, Chie protege seus amigos ferozmente e nunca recua diante do perigo.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
    },
    {
      gameId: p4.id,
      name: "Naoto Shirogane",
      roleTag: "Detetive Prodígio",
      personaName: "Sukuna-Hikona / Yamato-Takeru",
      arcana: "V - O Papa / O Hierofante",
      description: "A 5ª geração dos famosos detetives Shirogane, convocada pela polícia para decifrar a cadeia de homicídios de Inaba.",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
    },

    // P5
    {
      gameId: p5.id,
      name: "Joker (Ren Amamiya)",
      roleTag: "Líder dos Phantom Thieves",
      personaName: "Arsène & Satanael",
      arcana: "0 - O Louco (The Fool)",
      description: "O audacioso líder dos Ladrões Fantasmas. De dia, estudante discreto; à noite, mestre das sombras no Metaverso.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    },
    {
      gameId: p5.id,
      name: "Morgana (Mona)",
      roleTag: "Guia do Metaverso / Navegador",
      personaName: "Zorro / Diego",
      arcana: "I - O Mago (The Magician)",
      description: "Uma criatura misteriosa em forma de gato que ensina as regras do Metaverso aos Phantom Thieves e busca recuperar sua forma humana.",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop",
    },
    {
      gameId: p5.id,
      name: "Makoto Niijima (Queen)",
      roleTag: "Estrategista / Presidente do Conselho",
      personaName: "Johanna / Anat",
      arcana: "II - A Sacerdotisa (High Priestess)",
      description: "O cérebro tático do grupo. Pilota uma motocicleta Persona com socos devastadores de punho de ferro.",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
    },
    {
      gameId: p5.id,
      name: "Kasumi Yoshizawa (Violet)",
      roleTag: "Ginasta de Elite",
      personaName: "Cendrillon / Vanadis",
      arcana: "A Fé (The Faith)",
      description: "Ginasta rítmica prodígio com laços profundos com Joker e com o mistério do terceiro semestre de Persona 5 Royal.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    },
  ];

  for (const char of characters) {
    await prisma.character.create({ data: char });
  }
  console.log(`✅ ${characters.length} Personagens criados com sucesso!`);

  // 5. Criar Produtos da Loja ProjecSona
  const p3ProductStd = await prisma.product.create({
    data: {
      gameId: p3.id,
      name: "Persona 3 Reload - Standard Edition (Steam Key)",
      slug: "persona-3-reload-standard",
      edition: "Standard Edition",
      price: 244.93,
      originalPrice: 349.90,
      platform: "Steam",
      stockQuantity: 5,
      isFeatured: true,
      description: "Edição padrão completa de Persona 3 Reload para ativação imediata na Steam. Inclui o jogo base com suporte a conquistas e nuvem.",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    },
  });

  const p3ProductDlx = await prisma.product.create({
    data: {
      gameId: p3.id,
      name: "Persona 3 Reload - Digital Deluxe Edition (Steam Key)",
      slug: "persona-3-reload-deluxe",
      edition: "Digital Deluxe Edition",
      price: 299.90,
      originalPrice: 399.90,
      platform: "Steam",
      stockQuantity: 3,
      isFeatured: true,
      description: "Inclui jogo base + Livro de Arte Digital oficial + Trilha Sonora Digital com arranjos exclusivos do P-Studio.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    },
  });

  const p4Product = await prisma.product.create({
    data: {
      gameId: p4.id,
      name: "Persona 4 Revival / Golden - Deluxe Edition (Steam Key)",
      slug: "persona-4-revival-deluxe",
      edition: "Deluxe Edition",
      price: 59.94,
      originalPrice: 99.90,
      platform: "Steam",
      stockQuantity: 8,
      isFeatured: true,
      description: "Reviva o clássico atemporal vencedor de múltiplos prêmios com resolução 4K, áudio em japonês/inglês e cartas colecionáveis Steam.",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    },
  });

  const p5ProductStd = await prisma.product.create({
    data: {
      gameId: p5.id,
      name: "Persona 5 Royal - Standard Edition (Steam Key)",
      slug: "persona-5-royal-standard",
      edition: "Standard Edition",
      price: 119.96,
      originalPrice: 299.90,
      platform: "Steam",
      stockQuantity: 6,
      isFeatured: true,
      description: "A obra-prima dos RPGs modernos com mais de 40 DLCs inclusos gratuitamente (trajes, BGM e Personas lendárias).",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
    },
  });

  const p5ProductPre = await prisma.product.create({
    data: {
      gameId: p5.id,
      name: "Persona 5 Royal - Phantom Thieves Supreme Edition (Steam Key)",
      slug: "persona-5-royal-supreme",
      edition: "Supreme Collector Edition",
      price: 169.90,
      originalPrice: 349.90,
      platform: "Steam",
      stockQuantity: 4,
      isFeatured: false,
      description: "Inclui jogo completo, pacote de Personas DLC, livro de arte em alta definição e papel de parede dinâmico comemorativo.",
      image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
    },
  });

  console.log("✅ Produtos cadastrados no catálogo!");

  // 6. Cadastrar Chaves Steam Criptografadas no Estoque
  const sampleKeys = [
    // P3 Standard
    { product: p3ProductStd, keys: ["P3RE-7B9A-48FE-91C2", "P3RE-88AF-3321-DC89", "P3RE-1142-990A-EFB3", "P3RE-5561-AA88-3419", "P3RE-9011-88FE-7721"] },
    // P3 Deluxe
    { product: p3ProductDlx, keys: ["P3DLX-9981-AA11-4432", "P3DLX-5511-BC44-9981", "P3DLX-7744-1188-EE55"] },
    // P4
    { product: p4Product, keys: ["P4GD-4451-9988-AACC", "P4GD-8811-3322-FF99", "P4GD-1177-8899-0011", "P4GD-2233-4455-6677", "P4GD-9988-7766-5544", "P4GD-1234-5678-9012", "P4GD-ABCD-EF01-2345", "P4GD-FFEE-DDCC-BBAA"] },
    // P5 Royal Std
    { product: p5ProductStd, keys: ["P5RY-ABCD-1234-EF56", "P5RY-7890-WXYZ-1122", "P5RY-3344-5566-7788", "P5RY-9900-AABB-CCDD", "P5RY-EEFF-0011-2233", "P5RY-4455-6677-8899"] },
    // P5 Royal Supreme
    { product: p5ProductPre, keys: ["P5SUP-9911-AABB-CCDD", "P5SUP-2233-4455-6677", "P5SUP-8899-0011-2233", "P5SUP-FFEE-DDCC-BBAA"] },
  ];

  let totalKeys = 0;
  for (const group of sampleKeys) {
    for (const key of group.keys) {
      const { encrypted, hash } = encryptKey(key);
      await prisma.digitalKey.create({
        data: {
          productId: group.product.id,
          codeEncrypted: encrypted,
          codeHash: hash,
          status: "AVAILABLE",
        },
      });
      totalKeys++;
    }
  }
  console.log(`✅ ${totalKeys} Chaves Steam digitais criptografadas e inseridas no estoque!`);

  // 7. Criar Lojas Externas para Comparação de Preços
  const storeSteam = await prisma.externalStore.create({
    data: {
      name: "Steam Store Oficial",
      website: "https://store.steampowered.com",
      logoUrl: "https://cdn.akamai.steamstatic.com/store/home/store_home_share.jpg",
      reliabilityStatus: "OFFICIAL_STORE",
    },
  });

  const storeNuuvem = await prisma.externalStore.create({
    data: {
      name: "Nuuvem (Brasil)",
      website: "https://www.nuuvem.com",
      reliabilityStatus: "OFFICIAL_RESELLER",
    },
  });

  const storeGMG = await prisma.externalStore.create({
    data: {
      name: "Green Man Gaming",
      website: "https://www.greenmangaming.com",
      reliabilityStatus: "AUTHORIZED_PARTNER",
    },
  });

  const storeEpic = await prisma.externalStore.create({
    data: {
      name: "Epic Games Store",
      website: "https://store.epicgames.com",
      reliabilityStatus: "OFFICIAL_STORE",
    },
  });

  // 8. Cadastrar Ofertas Externas para o Comparador
  const offers = [
    // P3 Reload Offers
    { storeId: storeNuuvem.id, gameId: p3.id, productId: p3ProductStd.id, price: 258.90, originalPrice: 349.90, url: "https://www.nuuvem.com/br-pt/item/persona-3-reload", platform: "Steam" },
    { storeId: storeSteam.id, gameId: p3.id, productId: p3ProductStd.id, price: 349.90, originalPrice: 349.90, url: "https://store.steampowered.com/app/2161700/Persona_3_Reload/", platform: "Steam" },
    { storeId: storeGMG.id, gameId: p3.id, productId: p3ProductStd.id, price: 265.40, originalPrice: 349.90, url: "https://www.greenmangaming.com/games/persona-3-reload-pc/", platform: "Steam" },

    // P4 Golden / Revival Offers
    { storeId: storeNuuvem.id, gameId: p4.id, productId: p4Product.id, price: 69.90, originalPrice: 99.90, url: "https://www.nuuvem.com/br-pt/item/persona-4-golden", platform: "Steam" },
    { storeId: storeSteam.id, gameId: p4.id, productId: p4Product.id, price: 99.90, originalPrice: 99.90, url: "https://store.steampowered.com/app/1113000/Persona_4_Golden/", platform: "Steam" },
    { storeId: storeGMG.id, gameId: p4.id, productId: p4Product.id, price: 74.90, originalPrice: 99.90, url: "https://www.greenmangaming.com/games/persona-4-golden-pc/", platform: "Steam" },

    // P5 Royal Offers
    { storeId: storeNuuvem.id, gameId: p5.id, productId: p5ProductStd.id, price: 134.95, originalPrice: 299.90, url: "https://www.nuuvem.com/br-pt/item/persona-5-royal", platform: "Steam" },
    { storeId: storeSteam.id, gameId: p5.id, productId: p5ProductStd.id, price: 149.95, originalPrice: 299.90, url: "https://store.steampowered.com/app/1687950/Persona_5_Royal/", platform: "Steam" },
    { storeId: storeGMG.id, gameId: p5.id, productId: p5ProductStd.id, price: 128.90, originalPrice: 299.90, url: "https://www.greenmangaming.com/games/persona-5-royal-pc/", platform: "Steam" },
    { storeId: storeEpic.id, gameId: p5.id, productId: p5ProductStd.id, price: 299.90, originalPrice: 299.90, url: "https://store.epicgames.com/p/persona-5-royal", platform: "Epic" },
  ];

  for (const offer of offers) {
    await prisma.externalOffer.create({ data: offer });
  }

  console.log(`✅ ${offers.length} Ofertas de Lojas Externas cadastradas para comparação!`);

  // 9. Criar um Pedido de Demonstração já Concluído para o usuário Ren
  const orderNumber = "ORD-P5R-" + Math.floor(100000 + Math.random() * 900000);
  const demoOrder = await prisma.order.create({
    data: {
      orderNumber,
      userId: demoUser.id,
      totalAmount: 119.96,
      status: "COMPLETED",
      items: {
        create: {
          productId: p5ProductStd.id,
          quantity: 1,
          unitPrice: 119.96,
          subtotal: 119.96,
        },
      },
      payment: {
        create: {
          method: "PIX",
          status: "APPROVED",
          amount: 119.96,
          paidAt: new Date(),
          transactionRef: "PIX-E2E-PERSONA-2026-DEMO",
        },
      },
    },
    include: {
      items: true,
    },
  });

  // Atribuir uma chave vendida a este pedido demonstrativo
  const availableKey = await prisma.digitalKey.findFirst({
    where: { productId: p5ProductStd.id, status: "AVAILABLE" },
  });

  if (availableKey && demoOrder.items[0]) {
    await prisma.digitalKey.update({
      where: { id: availableKey.id },
      data: {
        status: "SOLD",
        soldAt: new Date(),
        orderItemId: demoOrder.items[0].id,
      },
    });
    console.log(`✅ Pedido histórico demonstrativo (${orderNumber}) criado com chave Steam vinculada!`);
  }

  console.log("🎉 Seed do ProjecSona concluído com êxito!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante a execução do seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
