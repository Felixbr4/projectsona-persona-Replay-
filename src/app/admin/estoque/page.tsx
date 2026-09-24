"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { KeyRound, Plus, Eye, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Keys Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [keysInput, setKeysInput] = useState("");
  const [addFeedback, setAddFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Inspect Keys Modal State
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [inspectProduct, setInspectProduct] = useState<any | null>(null);
  const [maskedKeys, setMaskedKeys] = useState<any[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/admin/inventory/keys");
      const json = await res.json();
      setInventory(json.overview || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openAddModal = (prodId?: string) => {
    setSelectedProductId(prodId || (inventory[0]?.id ?? ""));
    setKeysInput("");
    setAddFeedback(null);
    setIsAddModalOpen(true);
  };

  const openInspectModal = async (prod: any) => {
    setInspectProduct(prod);
    setIsInspectModalOpen(true);
    setIsLoadingKeys(true);
    try {
      const res = await fetch(`/api/admin/inventory/keys?productId=${prod.id}`);
      const json = await res.json();
      setMaskedKeys(json.keys || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingKeys(false);
    }
  };

  const handleAddKeysSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddFeedback(null);

    const keysArray = keysInput
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (keysArray.length === 0) {
      setAddFeedback({ message: "Insira ao menos uma chave válida.", type: "error" });
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch("/api/admin/inventory/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId,
          keys: keysArray,
        }),
      });
      const json = await res.json();
      setIsAdding(false);

      if (res.ok && json.success) {
        setAddFeedback({ message: json.message, type: "success" });
        setKeysInput("");
        fetchInventory();
        setTimeout(() => setIsAddModalOpen(false), 2000);
      } else {
        setAddFeedback({ message: json.error || "Erro ao adicionar chaves.", type: "error" });
      }
    } catch {
      setIsAdding(false);
      setAddFeedback({ message: "Erro de conexão ao servidor.", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-white font-display">
            Estoque & Cofre de Chaves Steam
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            Gerencie o estoque e insira lotes de chaves criptografadas (AES-256).
          </p>
        </div>

        <Button size="sm" variant="persona" onClick={() => openAddModal()} className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Lote de Chaves
        </Button>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-neutral-400 font-mono text-xs">
          Carregando inventário de chaves...
        </div>
      ) : (
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[10px] uppercase text-neutral-400">
                  <th className="py-4 px-6">Produto / Plataforma</th>
                  <th className="py-4 px-4">Jogo Relacionado</th>
                  <th className="py-4 px-4">Disponíveis</th>
                  <th className="py-4 px-4">Vendidas</th>
                  <th className="py-4 px-4">Total Cadastrado</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-white text-sm font-sans block">{item.name}</span>
                      <span className="text-[10px] text-neutral-400">{item.platform}</span>
                    </td>
                    <td className="py-4 px-4 text-theme-primary">{item.gameName}</td>
                    <td className="py-4 px-4">
                      {item.isOutOfStock ? (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 font-bold rounded">
                          0 (Esgotado)
                        </span>
                      ) : item.isLowStock ? (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 font-bold rounded">
                          {item.availableKeys} (Baixo)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded">
                          {item.availableKeys} un.
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-neutral-300">{item.soldKeys} un.</td>
                    <td className="py-4 px-4 text-neutral-400">{item.totalKeys} un.</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openInspectModal(item)}
                        className="p-1.5 text-xs"
                        title="Inspecionar códigos mascarados"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Ver Códigos
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => openAddModal(item.id)}
                        className="p-1.5 text-xs"
                      >
                        + Chaves
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Adicionar Lote de Chaves */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Adicionar Lote de Chaves Steam"
      >
        <form onSubmit={handleAddKeysSubmit} className="space-y-4">
          {addFeedback && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                addFeedback.type === "success"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-red-500/20 text-red-300 border border-red-500/40"
              }`}
            >
              {addFeedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>{addFeedback.message}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-1.5">
              Selecione o Produto de Destino
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-theme-primary focus:outline-none font-sans"
              required
            >
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.platform}) - Atual: {item.availableKeys} un.
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-1.5">
              Insira as Chaves Steam (Uma chave por linha)
            </label>
            <textarea
              value={keysInput}
              onChange={(e) => setKeysInput(e.target.value)}
              rows={6}
              placeholder="P5RY-1234-ABCD-5678&#10;P5RY-9988-WXYZ-1122&#10;P5RY-7766-EFGH-3344"
              className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white font-mono placeholder:text-neutral-600 focus:ring-2 focus:ring-theme-primary focus:outline-none"
              required
            />
            <p className="text-[10px] text-neutral-500 font-mono mt-1">
              🔒 As chaves serão criptografadas individualmente em AES-256 no banco de dados.
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Fechar
            </Button>
            <Button
              type="submit"
              variant="persona"
              size="sm"
              isLoading={isAdding}
            >
              Criptografar e Salvar no Estoque
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Inspecionar Códigos Mascarados */}
      <Modal
        isOpen={isInspectModalOpen}
        onClose={() => setIsInspectModalOpen(false)}
        title={`Chaves Cadastradas: ${inspectProduct?.name || ""}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-400 font-mono">
            Códigos com mascaramento de segurança (XXXX-XXXX-****-1234):
          </p>

          {isLoadingKeys ? (
            <div className="py-8 text-center text-xs font-mono text-neutral-500">
              Carregando chaves protegidas...
            </div>
          ) : maskedKeys.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              Nenhuma chave cadastrada para este produto.
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto divide-y divide-neutral-800 font-mono text-xs">
              {maskedKeys.map((k) => (
                <div key={k.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white tracking-wider block">
                      {k.maskedCode}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      Cadastrado em {new Date(k.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      k.status === "AVAILABLE"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {k.status === "AVAILABLE" ? "Disponível" : "Vendida"}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-neutral-800 text-right">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsInspectModalOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
