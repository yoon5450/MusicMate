


/**
 * @description "supabase 에러 관리하는 핸들러입니다."
 * @param {unknown} error 
 * @param {string} [context]  
 */


export default async function supErrorHandler(error: unknown, context?: string){
  console.error(`[Supabase Error]\n
    Func: ${context ?? ""}
    `);
  if(error && typeof error === "object"){
    console.error(error);
  }
}