import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;     
  
  // Ejemplo: @GetUser('id') retorna user.id
  // Si no se especifica, retorna el usuario completo
  return data ? user?.[data] : user;    
});