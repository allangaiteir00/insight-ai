import { computed, Injectable, signal } from '@angular/core';

export interface UserContext {
    id: string;
    name: string;
    email: string;
    roleId: string;
    tenantId: string;
}

export interface TenantContext {
    id: string;
    name: string;
    plan: string;
}

@Injectable({ providedIn: 'root' })
export class IdentityService {
    // Estado do usuário atual (Mock)
    private readonly _currentUser = signal<UserContext | null>(null);
    readonly currentUser = computed(() => this._currentUser());

    // Estado do tenant atual (Mock)
    private readonly _currentTenant = signal<TenantContext | null>(null);
    readonly currentTenant = computed(() => this._currentTenant());

    constructor() {
        this.initializeMockContext();
    }

    /**
     * Inicializa um contexto padrão para que o sistema funcione 
     * mesmo sem uma tela de login real implementada.
     */
    private initializeMockContext(): void {
        // Simulando Allan Gaiteiro logado na Acme Corp
        const mockTenant: TenantContext = {
            id: 'ten-acme', // Deve bater com o ID gerado no seed ou ser fixo
            name: 'Acme Corp',
            plan: 'pro'
        };

        const mockUser: UserContext = {
            id: 'usr-allan',
            name: 'Allan Gaiteiro',
            email: 'allan@acme.com',
            roleId: 'rol-admin',
            tenantId: mockTenant.id
        };

        this._currentTenant.set(mockTenant);
        this._currentUser.set(mockUser);
    }

    /** Verifica se o usuário tem uma permissão específica */
    hasPermission(capability: string): boolean {
        // Implementação básica de Admin tem tudo
        if (this._currentUser()?.roleId === 'rol-admin') return true;

        // Futuramente buscar do RoleEntity
        return false;
    }

    /** Altera o tenant ativo (útil para impersonation ou troca de workspace) */
    switchTenant(tenant: TenantContext): void {
        this._currentTenant.set(tenant);
        // Em um sistema real, isso recarregaria os dados
    }
}
