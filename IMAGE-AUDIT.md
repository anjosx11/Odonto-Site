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
| `assets/doctor/1.jpg` | 585×675 | 0,867 | 226.137 | Dentista, slide 1 | 585 px | Não; oficial idêntica |
| `assets/doctor/2.jpg` | 585×675 | 0,867 | 151.328 | Dentista, slide 2 | 585 px | Não; oficial idêntica |
| `assets/doctor/3.jpg` | 585×675 | 0,867 | 189.908 | Dentista, slide 3 | 585 px | Não; oficial idêntica |
| `assets/doctor/4.jpg` | 585×675 | 0,867 | 156.769 | Dentista, slide 4 | 585 px | Não; oficial idêntica |
| `assets/doctor/5.jpg` | 585×675 | 0,867 | 149.430 | Dentista, slide 5 | 585 px | Não; oficial idêntica |
| `assets/hero/molde2.jpg` | 1479×661 | 2,238 | 158.828 | Jornada | 100% do painel, sempre abaixo de 1479 px | É o original disponível |
| `assets/logo.jpg` | 400×227 | 1,762 | 20.920 | Cabeçalho e rodapé | 141 px | Não; oficial idêntica |

## Entrega responsiva

- Cada uma das 15 fotos dos carrosséis possui WebP na largura original e uma variação de 360 px.
- O HTML usa `picture`, `srcset` e `sizes`; o JPG original permanece como fallback.
- A primeira foto do hero tem preload e `fetchpriority="high"`; as demais usam lazy loading.
- Hero: moldura máxima de 537 px no desktop; no mobile, painel de aproximadamente 55 `svh`.
- Clínica e dentista: molduras `585 / 675`, com largura máxima de 585 px e `object-fit: cover`.
- A imagem horizontal da jornada reserva a proporção `1479 / 661` e possui fallback visível para falha de carregamento.
