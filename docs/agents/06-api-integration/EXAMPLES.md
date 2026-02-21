# Examples: API Integration Agent

## Exemplo 1 — Serviço de Produtos

**Input:**
> Service: ProductService
> Endpoint: /api/products
> Operação: Listar produtos

**Output:**

**[API Service: ProductService]**
```typescript
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private url = '/api/products';

  getAll() {
    return this.http.get<Product[]>(this.url);
  }
}
```

**[Interceptors / Error Handlers]**
```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
       // Mapeamento de erro de domínio
       return throwError(() => new DomainError(err.message));
    })
  );
};
```
