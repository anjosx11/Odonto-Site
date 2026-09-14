# Auditoria de imagens

Inventário conferido em 13/09/2026 contra os arquivos publicados em `vadentalclinic.com.br`. As cópias do site oficial têm as mesmas dimensões dos JPGs locais; não foi encontrada uma versão maior das fotos verticais. Por isso, o layout limita cada foto à largura natural e deixa de usá-las como banners de tela inteira.

| Arquivo original | Dimensão | Proporção | Bytes | Uso | Máximo de exibição | Versão maior |
|---|---:|---:|---:|---|---:|---|
| `assets/hero/1b.jpg` | 537×659 | 0,815 | 200.756 | Hero, slide 1 | 537 px | Não; oficial idêntica |
| `assets/hero/2b.jpg` | 537×659 | 0,815 | 207.084 | Hero, slide 2 | 537 px | Não; oficial idêntica |
| `assets/hero/3b.jpg` | 537×659 | 0,815 | 219.941 | Hero, slide 3 | 537 px | Não; oficial idêntica |
| `assets/hero/4b.jpg` | 537×659 | 0,815 | 223.261 | Hero, slide 4 | 537 px | Não; oficial idêntica |
| `assets/hero/5b.jpg` | 537×659 | 0,815 | 162.332 | Hero, slide 5 | 537 px | Não; oficial idêntica |
| `assets/hero/6b.jpg` | 537×659 | 0,815 | 182.497 | Hero, slide 6 | 537 px | Não; oficial idêntica |
| `assets/clinic/clinica1.jpg` | 585×675 | 0,867 | 237.922 | Ambientes, slide 1 | 585 px | Não; oficial idêntica |
| `assets/clinic/clinica2.jpg` | 585×675 | 0,867 | 221.919 | Ambientes, slide 2 | 585 px | Não; oficial idêntica |
| `assets/clinic/clinica3.jpg` | 585×675 | 0,867 | 187.668 | Ambientes, slide 3 | 585 px | Não; oficial idêntica |
| `assets/clinic/clinica4.jpg` | 585×675 | 0,867 | 170.852 | Ambientes, slide 4 | 585 px | Não; oficial idêntica |
| `assets/doctor/1.jpg` | 585×675 | 0,867 | 226.137 | Dentista, slide 1 | 500 px | Não; oficial idêntica |
| `assets/doctor/2.jpg` | 585×675 | 0,867 | 151.328 | Dentista, slide 2 | 500 px | Não; oficial idêntica |
| `assets/doctor/3.jpg` | 585×675 | 0,867 | 189.908 | Dentista, slide 3 e transição | 500 px | Não; oficial idêntica |
| `assets/doctor/4.jpg` | 585×675 | 0,867 | 156.769 | Dentista, slide 4 | 500 px | Não; oficial idêntica |
| `assets/doctor/5.jpg` | 585×675 | 0,867 | 149.430 | Dentista, slide 5 | 500 px | Não; oficial idêntica |
| `assets/hero/molde2.jpg` | 1479×661 | 2,238 | 158.828 | Arquivo preservado, não utilizado no layout atual | — | É o original disponível |
| `assets/logo.jpg` | 400×227 | 1,762 | 20.920 | Fonte oficial da marca | — | Não; oficial idêntica |
| `assets/logo-transparent.png` | 400×227 | 1,762 | 4.544 | Cabeçalho, menu e rodapé | 125 px | Extração transparente fiel do JPG oficial |

## Entrega responsiva

- Cada uma das 15 fotos dos carrosséis possui WebP na largura original e uma variação de 360 px.
- O HTML usa `picture`, `srcset` e `sizes`; o JPG original permanece como fallback.
- A primeira foto do hero tem preload e `fetchpriority="high"`; as demais usam lazy loading.
- O fundo uniforme do logo oficial foi removido de forma determinística, preservando desenho e proporção; o favicon transparente original foi mantido.
- Hero: moldura máxima de 537 px no desktop; no mobile, painel de aproximadamente 48 `svh`.
- Clínica: moldura `585 / 675`, com largura máxima de 585 px e `object-fit: cover`.
- Dentista: as cinco fotografias permanecem na ordem original; a moldura editorial foi limitada a 500 px para proteger especialmente a qualidade dos slides 2, 4 e 5.
- A antiga seção “Sua Jornada” e sua imagem foram removidas da interface; o arquivo original continua preservado no repositório.
