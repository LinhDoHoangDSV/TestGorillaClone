import dataSourceLocal from './data-source-local';
import dataSourceProd from './data-source-prod';

export default process.env.NODE_ENV === 'production'
  ? dataSourceProd
  : dataSourceLocal;
