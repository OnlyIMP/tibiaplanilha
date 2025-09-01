export const formatGold = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}kk`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }
  return value.toString();
};

export const parseGold = (value: string): number => {
  const cleanValue = value.trim().toLowerCase();
  
  // Se termina com kk ou mm, multiplica por 1 milhão
  if (cleanValue.endsWith('kk') || cleanValue.endsWith('mm')) {
    const numValue = parseFloat(cleanValue.replace(/[kmKM]+$/, ''));
    return numValue * 1000000;
  }
  
  // Se termina com k, multiplica por 1000
  if (cleanValue.endsWith('k')) {
    const numValue = parseFloat(cleanValue.replace(/[kK]+$/, ''));
    return numValue * 1000;
  }
  
  // Caso contrário, retorna o valor puro
  return parseFloat(cleanValue) || 0;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};