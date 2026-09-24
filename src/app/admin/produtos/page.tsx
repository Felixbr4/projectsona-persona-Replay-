"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Package } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    gameId: "",
    edition: "Standard Edition",
    price: "",
    originalPrice: "",
    platform: "Steam",
    description: "",
    active: true,
    isFeatured: false,
    image: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [prodRes, gameRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/games"),
      ]);
      const prodData = await prodRes.json();
      const gameData = await gameRes.json();

      setProducts(prodData.products || []);
      setGames(gameData.games || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      gameId: games[0]?.id || "",
      edition: "Standard Edition",
      price: "",
      originalPrice: "",
      platform: "Steam",
      description: "",
      active: true,
      isFeatured: false,
      image: "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      slug: prod.slug,
      gameId: prod.gameId,
      edition: prod.edition,
      price: String(prod.price),
      originalPrice: prod.originalPrice ? String(prod.originalPrice) : "",
      platform: prod.platform,
      description: prod.description,
      active: prod.active,
      isFeatured: prod.isFeatured,
      image: prod.image || "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      };

      let res;
      if (editingProduct) {
        res = await fetch("/api/admin/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProduct.id, ...payload }),
        });
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      setIsSaving(false);

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        setFormError(json.error || "Erro ao salvar produto.");
      }
    } catch {
      setIsSaving(false);
      setFormError("Erro de conexão com o servidor.");
    }
  };

  const handleDeactivate = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente desativar o produto "${name}"? Ele será ocultado do catálogo sem apagar o histórico de pedidos.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-white font-display">
            Gerenciamento de Produtos
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            Cadastre, edite e controle o status de exibição das edições Persona.
          </p>
        </div>

        <Button size="sm" variant="persona" onClick={openCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          Cadastrar Novo Produto
        </Button>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-neutral-400 font-mono text-xs">
          Carregando catálogo de produtos...
        </div>
      ) : (
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[10px] font-mono uppercase text-neutral-400">
                  <th className="py-4 px-6">Produto / Jogo</th>
                  <th className="py-4 px-4">Edição / Plataforma</th>
                  <th className="py-4 px-4">Preço (R$)</th>
                  <th className="py-4 px-4">Chaves Disponíveis</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {products.map((prod) => {
                  const availableKeys = prod._count?.digitalKeys ?? prod.stockQuantity;

                  return (
                    <tr key={prod.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white text-sm">{prod.name}</div>
                        <div className="text-[10px] text-theme-primary font-mono">{prod.game?.name}</div>
                      </td>
                      <td className="py-4 px-4 text-neutral-300">
                        <span>{prod.edition}</span>
                        <span className="block text-[10px] text-neutral-500">{prod.platform}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-emerald-400 text-sm">
                          R$ {prod.price.toFixed(2)}
                        </span>
                        {prod.originalPrice && (
                          <span className="block text-[10px] text-neutral-500 line-through">
                            R$ {prod.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`font-bold ${
                            availableKeys > 0 ? "text-cyan-400" : "text-red-400"
                          }`}
                        >
                          {availableKeys} chaves
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {prod.active ? (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
                            Ativo
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-[10px] font-bold">
                            Inativo
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 hover:text-white transition-colors"
                          title="Editar produto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeactivate(prod.id, prod.name)}
                          className="p-1.5 bg-neutral-800 hover:bg-red-500/20 rounded-lg text-neutral-300 hover:text-red-400 transition-colors"
                          title="Desativar produto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Criar / Editar Produto */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Editar Produto" : "Cadastrar Novo Produto"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs font-bold text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Nome do Produto"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Persona 5 Royal - Phantom Thieves Deluxe"
                required
              />
            </div>

            <div>
              <Input
                label="Slug Único"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="persona-5-royal-deluxe"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-1.5">
                Jogo Relacionado
              </label>
              <select
                value={formData.gameId}
                onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-theme-primary focus:outline-none"
                required
              >
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                label="Preço de Venda (R$)"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="199.90"
                required
              />
            </div>

            <div>
              <Input
                label="Preço Original De / Risco (R$)"
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="299.90"
              />
            </div>

            <div>
              <Input
                label="Edição"
                value={formData.edition}
                onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                placeholder="Standard Edition"
                required
              />
            </div>

            <div>
              <Input
                label="Plataforma"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                placeholder="Steam"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="URL da Imagem de Capa"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-1.5">
                Descrição Completa
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Detalhes sobre o conteúdo da edição e ativação..."
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-theme-primary focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded bg-neutral-900 border-neutral-700 text-red-600 focus:ring-red-500"
              />
              <span>Produto Ativo no Catálogo</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded bg-neutral-900 border-neutral-700 text-red-600 focus:ring-red-500"
              />
              <span>Destaque na Home</span>
            </label>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
            >
              Salvar Registro
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
