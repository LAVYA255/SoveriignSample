import { useState } from 'react';
import { ShieldCheck, Search, Plus } from 'lucide-react';
import { trpc } from '@/providers/trpc';

export default function AdminPanel() {
  const [search, setSearch] = useState('');
  const [amountInputs, setAmountInputs] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.admin.getAllUsers.useQuery();
  const creditMutation = trpc.admin.creditWallet.useMutation();

  const handleCredit = async (userId: string, username: string) => {
    const amountStr = amountInputs[userId];
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0) return;

    try {
      await creditMutation.mutateAsync({ userId, amount });
      setAmountInputs((prev) => ({ ...prev, [userId]: '' }));
      setSuccessMsg(`Successfully credited Rs.${amount} to ${username}`);
      utils.admin.getAllUsers.invalidate();
      
      setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);
    } catch (error: any) {
      alert(`Failed to add funds: ${error.message}`);
    }
  };

  const filteredUsers = (users as any[])?.filter((user: any) => 
    user.username?.toLowerCase().includes(search.toLowerCase()) || 
    user.email?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center">
          <ShieldCheck size={24} className="text-orange-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          <p className="text-neutral-500">Manage users and wallet balances</p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg mb-6">
          {successMsg}
        </div>
      )}

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">User</th>
                <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">Role</th>
                <th className="text-right text-xs font-medium text-neutral-500 px-4 py-3">Balance</th>
                <th className="text-right text-xs font-medium text-neutral-500 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-neutral-500">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-neutral-500">No users found</td>
                </tr>
              ) : (
                filteredUsers.map((u: any) => (
                  <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-600/15 flex items-center justify-center">
                          <span className="text-sm font-bold text-orange-400">{u.username?.charAt(0) || "U"}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{u.username}</p>
                          <p className="text-xs text-neutral-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium capitalize ${u.role === "admin" ? "bg-orange-500/15 text-orange-400" : "bg-white/5 text-neutral-400"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-medium text-white">Rs.{Number(u.wallet_balance || 0).toLocaleString("en-IN")}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={amountInputs[u.id] || ''}
                          onChange={(e) => setAmountInputs(prev => ({ ...prev, [u.id]: e.target.value }))}
                          className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500"
                        />
                        <button
                          onClick={() => handleCredit(u.id, u.username)}
                          disabled={!amountInputs[u.id] || Number(amountInputs[u.id]) <= 0 || creditMutation.isPending}
                          className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus size={14} /> Add Funds
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
