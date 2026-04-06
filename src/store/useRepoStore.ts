import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import fallbackRepos from '../data/repos.json';

export interface Repository {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    languages: string[];
    topics: string[];
    updated_at: string;
    default_branch: string;
    languages_url: string;
}

interface RepoState {
    repos: Repository[];
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
    fetchRepos: (force?: boolean) => Promise<void>;
    clearCache: () => void;
}

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const useRepoStore = create<RepoState>()(
    persist(
        (set, get) => ({
            repos: (fallbackRepos as unknown as Repository[]).filter(r => r.name.toLowerCase() !== 'kodekenobi.github.io'),
            loading: false,
            error: null,
            lastFetched: null,

            fetchRepos: async (force = false) => {
                const { lastFetched, loading, repos: existingRepos } = get();
                const now = Date.now();

                // Skip if already loading
                if (loading) return;

                // Skip if cached and not forced
                if (!force && lastFetched && (now - lastFetched < CACHE_DURATION) && existingRepos.length > 0) {
                    console.log("useRepoStore: Using cached repository data");
                    return;
                }

                console.log("useRepoStore: Attempting to fetch from GitHub...");
                set({ loading: true, error: null });

                try {
                    const headers: HeadersInit = {
                        'Accept': 'application/vnd.github.v3+json',
                    };

                    const token = import.meta.env.VITE_GITHUB_TOKEN;
                    if (token) {
                        headers['Authorization'] = `token ${token}`;
                    }

                    const response = await fetch("https://api.github.com/users/KodeKenobi/repos?sort=updated&per_page=100", { headers });

                    if (response.status === 403) {
                        console.warn("useRepoStore: GitHub API Rate Limit exceeded.");
                        // Hierarchy: If we have existing data in memory or localStorage (already handled by persist), keep it.
                        // If completely empty OR forced, show the bundled repos.json as better "baseline" than mocks.
                        if (existingRepos.length === 0 || force) {
                            console.log("useRepoStore: Using bundled src/data/repos.json as fallback.");
                            set({ 
                                repos: (fallbackRepos as unknown as Repository[]).filter(r => r.name.toLowerCase() !== 'kodekenobi.github.io'), 
                                lastFetched: now, 
                                loading: false 
                            });
                        } else {
                            set({ loading: false });
                        }
                        return;
                    }

                    if (!response.ok) throw new Error(`GitHub API error: ${response.statusText}`);

                    const data = await response.json();

                    // Filter logic
                    let filtered = data.filter((r: any) =>
                        !r.fork &&
                        r.name.toLowerCase() !== 'thuis' &&
                        r.name.toLowerCase() !== 'kodekenobi.github.io' &&
                        !r.name.toLowerCase().includes('trevnoctilla')
                    );

                    if (filtered.length === 0 && data.length > 0) {
                        filtered = data.slice(0, 10);
                    }

                    // Initial set
                    set({ repos: filtered, lastFetched: now, loading: false });

                    // Background fetch for languages
                    filtered.forEach(async (repo: any) => {
                        try {
                            const langRes = await fetch(repo.languages_url);
                            if (langRes.ok) {
                                const langData = await langRes.json();
                                const allLangs = Object.keys(langData);
                                const primaryLangs = allLangs.filter(l => !['HTML', 'CSS', 'SCSS', 'Less'].includes(l));
                                const finalLangs = primaryLangs.length > 0 ? primaryLangs.slice(0, 3) : allLangs.slice(0, 3);

                                set((state) => ({
                                    repos: state.repos.map(r => r.id === repo.id ? { ...r, languages: finalLangs } : r)
                                }));
                            }
                        } catch (e) {
                            console.error(`useRepoStore: Failed to fetch languages for ${repo.name}`, e);
                        }
                    });

                } catch (err: any) {
                    console.error("useRepoStore: Fetch failed", err);
                    set({
                        error: err.message,
                        loading: false,
                        // If completely empty, use bundled repos.json
                        repos: existingRepos.length > 0 
                            ? existingRepos.filter(r => r.name.toLowerCase() !== 'kodekenobi.github.io') 
                            : (fallbackRepos as unknown as Repository[]).filter(r => r.name.toLowerCase() !== 'kodekenobi.github.io'),
                        lastFetched: existingRepos.length > 0 ? lastFetched : now
                    });
                }
            },
            clearCache: () => {
                set({ repos: [], lastFetched: null, error: null });
                localStorage.removeItem('repo-storage');
                console.log("useRepoStore: Cache cleared.");
            },
        }),
        {
            name: 'repo-storage-v4',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
