"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Plus, Trash2, ExternalLink, Sparkles, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    storeId: "",
    gameId: "",
    price: "",
    originalPrice: "",
    url: "",
    platform: "Steam",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/offers");
      const json = await res.json();
      setOffers(json.offers || []);
      setStores(json.stores || []);
      setGames(json.games || []);
      if (json.stores?.length > 0 && !formData.storeId) {
        setFormData((prev) => ({
          ...prev,
          storeId: json.stores[0].id,
          gameId: json.games[0]?.id || "",
        }));
      }
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
    setFormData({
      storeId: stores[0]?.id || "",
      gameId: games[0]?.id || "",
      price: "",
      originalPrice: "",
      url: "",
      platform: "Steam",
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

      const res = await fetch("/api/admin/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      setIsSaving(false);

      if (res.ok && json.success) {
        setIsModalOpen(false);
        fetchData();
      } else {
        setFormError(json.error || "Erro ao cadastrar oferta.");
      }
    } catch {
      setIsSaving(false);
      setFormError("Erro de conexão ao cadastrar.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja remover esta oferta externa?")) return;
    try {
      const res = await fetch(`/api/admin/offers?id=${id}`, { method: "DELETE" });
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
            Ofertas & Lojas Externas
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            Cadastre os preços praticados por lojas parceiras para alimentar o comparador.
          </p>
        </div>

        <Button size="sm" variant="persona" onClick={openCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          Cadastrar Nova Oferta
        </Button>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-neutral-400 font-mono text-xs">
          Carregando ofertas externas...
        </div>
      ) : (
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[10px] uppercase text-neutral-400">
                  <th className="py-4 px-6">Loja Parceira</th>
                  <th className="py-4 px-4">Jogo</th>
                  <th className="py-4 px-4">Plataforma</th>
                  <th className="py-4 px-4">Preço Cadastrado</th>
                  <th className="py-4 px-4">Link da Oferta</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {offers.map((off) => (
                  <tr key={off.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-white text-sm font-sans block">
                        {off.store.name}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {off.store.reliabilityStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-theme-primary font-bold">{off.game.name}</td>
                    <td className="py-4 px-4 text-neutral-300">{off.platform}</td>
                    <td className="py-4 px-4 font-bold text-emerald-400 text-sm">
                      R$ {off.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <a
                        href={off.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-theme-primary hover:underline"
                      >
                        <span>Abrir URL</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(off.id)}
                        className="p-1.5 bg-neutral-800 hover:bg-red-500/20 rounded-lg text-neutral-300 hover:text-red-400 transition-colors"
                        title="Remover oferta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Cadastrar Nova Oferta */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Oferta de Loja Externa"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs font-bold text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-1.5">
              Loja Parceira
            </label>
            <select
              value={formData.storeId}
              onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
              className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-theme-primary focus:outline-none font-sans"
              required
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-1.5">
              Jogo Correspondente
            </label>
            <select
              value={formData.gameId}
              onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
              className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-theme-primary focus:outline-none font-sans"
              required
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                label="Preço Encontrado (R$)"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="249.90"
                required
              />
            </div>
            <div>
              <Input
                label="Preço Cheio Original (R$)"
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="349.90"
              />
            </div>
          </div>

          <Input
            label="URL da Oferta Externa"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://store.steampowered.com/app/..."
            required
          />

          <Input
            label="Plataforma"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            placeholder="Steam"
            required
          />

          <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
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
              variant="persona"
              size="sm"
              isLoading={isSaving}
            >
              Salvar Oferta
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
