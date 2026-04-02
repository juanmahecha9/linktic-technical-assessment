import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      // CASO DE ÉXITO
      map((data) => {
        return {
          status: HttpStatus.OK,
          allow: true,
          message: 'Request successful',
          info: data,
        };
      }),
      // CASO DE ERROR
      catchError((error) => {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'An unexpected error occurred';
        let info: any = error.message;

        if (error instanceof HttpException) {
          status = error.getStatus();
          message = error.message;
          const response = error.getResponse();
          // Extraemos el cuerpo del error si Nest ya lo formateó (para validaciones de DTO, por ejemplo)
          info =
            typeof response === 'object'
              ? (response as any).message || response
              : response;
        }

        // Lanzamos una nueva excepción con la MISMA estructura que el mapa de éxito
        return throwError(
          () =>
            new HttpException(
              {
                status,
                allow: false,
                message,
                info,
              },
              status,
            ),
        );
      }),
    );
  }
}
