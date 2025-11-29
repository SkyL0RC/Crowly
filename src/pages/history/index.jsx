import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import QuickActionsBar from '../../components/QuickActionsBar';
import Icon from '../../components/AppIcon';
import TransactionList from './components/TransactionList';
import FilterBar from './components/FilterBar';
import SearchBar from './components/SearchBar';
import ExportButton from './components/ExportButton';
import { getTransactionHistory } from '../../services/api';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all', // all, send, receive, swap
    network: 'all', // all, ethereum, tron, bitcoin, solana
    status: 'all', // all, completed, pending, failed
    dateRange: 'all' // all, today, week, month, year
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const walletAddress = localStorage.getItem('walletAddress') || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  useEffect(() => {
    fetchTransactionHistory();
  }, [walletAddress]);

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, transactions]);

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);
      
      // Mock data - backend yoksa
      if (!walletAddress || walletAddress === '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb') {
        const mockTransactions = generateMockTransactions();
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
        setLoading(false);
        return;
      }
      
      const response = await getTransactionHistory(walletAddress, {
        limit: 100
      });
      
      if (response.success) {
        setTransactions(response.data);
        setFilteredTransactions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
      // Hata durumunda mock data göster
      const mockTransactions = generateMockTransactions();
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTransactions = () => {
    const types = ['send', 'receive', 'swap'];
    const networks = ['ethereum', 'tron', 'bitcoin', 'solana'];
    const statuses = ['completed', 'pending', 'failed'];
    const tokens = ['ETH', 'USDT', 'TRX', 'BTC', 'SOL', 'USDC'];
    
    // Sabit tutarlar - her transaction için önceden belirlenmiş
    const fixedAmounts = [
      0.0012, 0.0023, 0.0031, 0.0018, 0.0027, 0.0021, 0.0035, 0.0015,
      0.0024, 0.0029, 0.0022, 0.0037, 0.0016, 0.0026, 0.0020, 0.0033,
      0.0014, 0.0028, 0.0024, 0.0018, 0.0036, 0.0022, 0.0031, 0.0019,
      0.0025, 0.0016, 0.0030, 0.0022, 0.0027, 0.0019, 0.0033, 0.0015,
      0.0024, 0.0028, 0.0021, 0.0035, 0.0017, 0.0026, 0.0020, 0.0032,
      0.0014, 0.0028, 0.0023, 0.0018, 0.0035, 0.0021, 0.0031, 0.0019,
      0.0025, 0.0016
    ];

    // Sabit indeksler - her transaction için önceden belirlenmiş
    const fixedTypeIndices = [0, 1, 0, 2, 1, 0, 1, 2, 0, 1, 0, 2, 1, 0, 2, 1, 0, 1, 2, 0, 1, 0, 2, 1, 0, 1, 2, 0, 1, 0, 2, 1, 0, 1, 2, 0, 1, 0, 2, 1, 0, 1, 2, 0, 1, 0, 2, 1, 0, 1];
    const fixedNetworkIndices = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1];
    const fixedTokenIndices = [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1];
    
    // Sabit tarihler (geriye doğru günler)
    const baseDate = new Date('2024-11-29T12:00:00Z');
    
    return Array.from({ length: 50 }, (_, i) => {
      const type = types[fixedTypeIndices[i]];
      const network = networks[fixedNetworkIndices[i]];
      const status = i < 45 ? 'completed' : statuses[i % 3];
      const token = tokens[fixedTokenIndices[i]];
      const amount = fixedAmounts[i]; // Sabit tutar kullan
      const date = new Date(baseDate.getTime() - (i * 12 * 60 * 60 * 1000)); // Her transaction 12 saat öncesi
      
      return {
        id: `tx_${i + 1}`,
        hash: `0x${(i + 1).toString(16).padStart(64, '0')}`, // Sabit hash
        type: type,
        network: network,
        token: token,
        amount: amount.toFixed(4),
        usdValue: (parseFloat(amount) * (token === 'BTC' ? 40000 : token === 'ETH' ? 2000 : 1)).toFixed(2),
        from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        to: `0x${(1000 + i).toString(16).padStart(40, '0')}`, // Sabit adres
        status: status,
        timestamp: date.toISOString(),
        fee: (0.0001 * (i + 1)).toFixed(4), // Sabit fee
        confirmations: status === 'completed' ? 10 + i : 0
      };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(tx => tx.type === filters.type);
    }

    // Network filter
    if (filters.network !== 'all') {
      filtered = filtered.filter(tx => tx.network === filters.network);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(tx => tx.status === filters.status);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(tx => new Date(tx.timestamp) >= filterDate);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.hash.toLowerCase().includes(query) ||
        tx.to.toLowerCase().includes(query) ||
        tx.from.toLowerCase().includes(query) ||
        tx.token.toLowerCase().includes(query)
      );
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleExport = () => {
    const csv = convertToCSV(filteredTransactions);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction-history-${Date.now()}.csv`;
    a.click();
  };

  const convertToCSV = (data) => {
    const headers = ['Date', 'Type', 'Network', 'Token', 'Amount', 'USD Value', 'Status', 'Hash'];
    const rows = data.map(tx => [
      new Date(tx.timestamp).toLocaleString(),
      tx.type,
      tx.network,
      tx.token,
      tx.amount,
      tx.usdValue,
      tx.status,
      tx.hash
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: filteredTransactions.length,
    completed: filteredTransactions.filter(tx => tx.status === 'completed').length,
    pending: filteredTransactions.filter(tx => tx.status === 'pending').length,
    failed: filteredTransactions.filter(tx => tx.status === 'failed').length,
    totalVolume: filteredTransactions.reduce((sum, tx) => sum + parseFloat(tx.usdValue), 0).toFixed(2)
  };

  return (
    <>
      <Helmet>
        <title>Transaction History - Crowly</title>
        <meta 
          name="description" 
          content="View your complete transaction history across all blockchain networks with advanced filtering and export options." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="main-content">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent bg-opacity-20">
                  <Icon name="History" size={24} className="text-accent" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Transaction History</h1>
              </div>
              <p className="text-muted-foreground">
                Track and manage all your cryptocurrency transactions across multiple networks
              </p>
            </div>

            <div className="mb-6">
              <QuickActionsBar />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="card-elevated">
                <div className="text-sm text-muted-foreground mb-1">Total</div>
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              </div>
              <div className="card-elevated">
                <div className="text-sm text-muted-foreground mb-1">Completed</div>
                <div className="text-2xl font-bold text-success">{stats.completed}</div>
              </div>
              <div className="card-elevated">
                <div className="text-sm text-muted-foreground mb-1">Pending</div>
                <div className="text-2xl font-bold text-warning">{stats.pending}</div>
              </div>
              <div className="card-elevated">
                <div className="text-sm text-muted-foreground mb-1">Failed</div>
                <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
              </div>
              <div className="card-elevated">
                <div className="text-sm text-muted-foreground mb-1">Total Volume</div>
                <div className="text-2xl font-bold text-accent">${stats.totalVolume}</div>
              </div>
            </div>

            {/* Search and Export */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
              />
              <ExportButton 
                onClick={handleExport}
                disabled={filteredTransactions.length === 0}
              />
            </div>

            {/* Filters */}
            <FilterBar 
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            {/* Transaction List */}
            {loading ? (
              <div className="card-elevated flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading transactions...</p>
                </div>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="card-elevated flex flex-col items-center justify-center py-12">
                <Icon name="Inbox" size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No transactions found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {searchQuery || Object.values(filters).some(f => f !== 'all')
                    ? 'Try adjusting your filters or search query'
                    : 'Your transaction history will appear here once you make your first transaction'}
                </p>
              </div>
            ) : (
              <>
                <TransactionList transactions={paginatedTransactions} />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-border bg-surface hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-2 rounded-lg border transition-colors ${
                                currentPage === pageNum
                                  ? 'border-accent bg-accent text-background font-medium'
                                  : 'border-border bg-surface hover:bg-background'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-border bg-surface hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default History;
