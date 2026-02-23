# Examples: Testing Agent

## Exemplo 1 — Teste de um Service de Dados

**Input:**
> Alvo: ProductService
> Operação: Obter lista de produtos

**Output:**

**[Test Suite: ProductService]**
```typescript
describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('deve buscar produtos via GET', () => {
    service.getAll().subscribe(products => {
      expect(products.length).toBe(1);
    });

    const req = httpMock.expectOne('/api/products');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: '1', name: 'Teste' }]);
  });
});
```

**[Cobertura Estimada]**
| Branch | Coberto? |
|---|---|
| Sucesso na listagem | ✅ |
| Erro de rede | ❌ (Exemplo simplificado) |
