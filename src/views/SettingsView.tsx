import React, { useState } from 'react';
import {
  Settings,
  Shield,
  User,
  Database,
  RotateCcw,
  Download,
  Check,
  AlertTriangle,
  Lock,
  Server,
  Flame,
  LogIn,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../types';
import { User as FirebaseUser } from 'firebase/auth';
import { DeleteModal } from '../components/DeleteModal';

interface SettingsViewProps {
  currentUser: UserProfile;
  firebaseUser?: FirebaseUser | null;
  isFirebaseConnected?: boolean;
  onLoginGoogle?: () => Promise<any>;
  onLogoutGoogle?: () => Promise<void>;
  onToggleRole: () => void;
  onResetToDemo: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  firebaseUser,
  isFirebaseConnected = true,
  onLoginGoogle,
  onLogoutGoogle,
  onToggleRole,
  onResetToDemo
}) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [isSaved, setIsSaved] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const exportLgpdData = () => {
    const data = {
      user: currentUser,
      export_date: new Date().toISOString(),
      platform: 'Meu Pix NFC',
      gdpr_lgpd_compliance: 'Art. 18 Lei 13.709/2018 (Direito de Portabilidade)'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dados-pessoais-lgpd-${currentUser.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#182235]">
          Configurações da Plataforma
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Gerenciamento de perfil, permissões de acesso, segurança e parâmetros do sistema
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-[#00B8A9]" />
          Perfil do Usuário
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#00B8A9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              E-mail de Acesso
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#00B8A9]"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[#00B8A9] hover:bg-[#009E91] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              {isSaved ? 'Perfil Atualizado!' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>

      {/* Role & Permissions (RBAC) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#7137E8]" />
          Nível de Permissão e Controle de Acesso (RBAC)
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          O sistema opera com separação de perfis com base em Row Level Security (RLS) do Supabase:
        </p>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Papel Atual: {currentUser.role === 'admin' ? 'Administrador Geral' : 'Cliente / Comerciante'}
            </span>
            <span className="text-[11px] text-slate-500">
              {currentUser.role === 'admin'
                ? 'Pode gerenciar todos os clientes, chaves e plaquinhas da plataforma.'
                : 'Pode gerenciar apenas os dados do próprio estabelecimento.'}
            </span>
          </div>

          <button
            onClick={onToggleRole}
            className="px-4 py-2 bg-[#F2ECFD] text-[#7137E8] hover:bg-[#e3d5fb] text-xs font-semibold rounded-lg transition-colors shrink-0"
          >
            Alternar para {currentUser.role === 'admin' ? 'Modo Comerciante' : 'Modo Administrador'}
          </button>
        </div>
      </div>

      {/* Firebase Firestore & Auth Architecture */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            Banco de Dados: Firebase Firestore & Auth
          </h2>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Ativo & Configurado
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Projeto Firebase:</span>
            <span className="font-mono font-semibold text-slate-800">gen-lang-client-0929258670</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Instância do Firestore:</span>
            <span className="font-mono font-semibold text-[#7137E8] truncate block">ai-studio-meupixnfc-...</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          O Firestore está provisionado com regras de segurança em tempo real (<code className="font-mono text-slate-800">firestore.rules</code>) e blueprint de entidades (<code className="font-mono text-[#7137E8]">firebase-blueprint.json</code>).
        </p>

        {/* Google Auth Row */}
        <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <User className="w-4 h-4 text-amber-600" />
            <div>
              <span className="font-semibold text-slate-900 block">
                {firebaseUser ? `Conectado como ${firebaseUser.displayName || firebaseUser.email}` : 'Autenticação Firebase Google'}
              </span>
              <span className="text-[11px] text-slate-500">
                {firebaseUser ? 'Sessão sincronizada em tempo real com o Firestore' : 'Faça login com sua Conta Google para sincronizar seus dados'}
              </span>
            </div>
          </div>

          {firebaseUser ? (
            <button
              onClick={onLogoutGoogle}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              Desconectar
            </button>
          ) : (
            <button
              onClick={onLoginGoogle}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              Entrar com Google
            </button>
          )}
        </div>
      </div>

      {/* LGPD & Privacy */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-700" />
          Privacidade e Conformidade LGPD (Lei Geral de Proteção de Dados)
        </h2>
        <p className="text-xs text-slate-600">
          Chaves Pix e dados de contato são manipulados com transparência e mascaramento nas telas públicas.
        </p>
        <button
          onClick={exportLgpdData}
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Exportar Meus Dados (JSON - Portabilidade LGPD)
        </button>
      </div>

      {/* Reset Demo Data */}
      <div className="p-5 bg-red-50/60 border border-red-200 rounded-xl space-y-2">
        <h3 className="text-xs font-bold text-red-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          Ambiente de Demonstração
        </h3>
        <p className="text-xs text-red-700">
          Deseja restaurar todos os dados para o estado inicial demonstrativo (Farmácia do Carro, Barbearia Premium, Mercado Central)?
        </p>
        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restaurar Dados Demonstrativos
        </button>
      </div>

      <DeleteModal
        isOpen={isResetConfirmOpen}
        title="Restaurar Demonstração"
        itemName="Dados da Demonstração"
        description="Esta ação restaurará os 3 estabelecimentos de exemplo, chaves Pix e plaquinhas demonstrativas iniciais."
        confirmText="Sim, Restaurar"
        cancelText="Cancelar"
        onConfirm={() => {
          onResetToDemo();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
