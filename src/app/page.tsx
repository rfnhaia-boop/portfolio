import { Metadata } from 'next';
import PortfolioContent from './PortfolioContent';

export const metadata: Metadata = {
  title: 'Rafael | Senior Data Architect & Technical Leader',
  description: 'Arquitetando soluções robustas de dados, agentes inteligentes de IA e engenharia de software de ponta a ponta para negócios de alta escala.',
  openGraph: {
    title: 'Rafael | Senior Data Architect & Technical Leader',
    description: 'Portfólio profissional de arquitetura de dados, sistemas distribuídos e engenharia de software.',
    type: 'website',
  },
};

export default function Home() {
  return <PortfolioContent />;
}
