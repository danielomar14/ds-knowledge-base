export const concepts = [
  {
    id: 1,
    section: "I. Fundamentos Numéricos y Funcionales",
    sectionCode: "I",
    name: "Número real",
    tags: ["análisis real", "axiomática", "completitud", "continuidad", "fundamentos"],
    definition: "Un número real es un elemento del único cuerpo arquimediano completo (salvo isomorfismo), denotado ℝ. Extiende a los racionales incluyendo los irracionales, y se caracteriza por la propiedad del supremo: todo subconjunto no vacío acotado superiormente posee un supremo en ℝ.",
    formal: {
      notation: "Sea $\\mathbb{R}$ el cuerpo ordenado completo único (salvo isomorfismo de cuerpos ordenados)",
      body: "\\mathbb{R} \\text{ es un cuerpo ordenado completo, es decir, una tupla } (\\mathbb{R},\\, +,\\, \\cdot,\\, \\leq) \\text{ tal que:} \\\\ \\quad (1)\\; (\\mathbb{R}, +, \\cdot) \\text{ es un cuerpo (field)} \\\\ \\quad (2)\\; \\leq \\text{ es un orden total compatible con las operaciones} \\\\ \\quad (3)\\; \\textbf{Completitud (propiedad del supremo):} \\\\ \\qquad \\forall\\, S \\subseteq \\mathbb{R},\\; S \\neq \\emptyset,\\; S \\text{ acotado superiormente} \\implies \\exists\\, \\sup S \\in \\mathbb{R}",
      geometric: "\\mathbb{R} \\cong \\{\\text{puntos de la recta numérica}\\} \\quad \\text{con distancia } d(x,y) = |x - y|, \\text{ espacio métrico completo y separable}",
      properties: [
        "\\text{Arquimediana: } \\forall\\, x \\in \\mathbb{R},\\; \\exists\\, n \\in \\mathbb{N} \\text{ tal que } n > x",
        "\\text{Densidad de } \\mathbb{Q}: \\forall\\, a < b \\in \\mathbb{R},\\; \\exists\\, q \\in \\mathbb{Q} \\text{ con } a < q < b",
        "\\text{No numerable: } |\\mathbb{R}| = 2^{\\aleph_0} > \\aleph_0 = |\\mathbb{Q}| \\quad (\\text{Cantor, 1874})",
      ],
    },
    intuition: "Imagina una recta perfectamente continua, sin huecos. Los enteros son postes de luz equidistantes; los racionales son todas las fracciones de esa distancia — densas, pero dejando infinitos 'huecos irracionales' como $\\sqrt{2}$ o $\\pi$. Los reales 'rellenan' todos esos huecos: cualquier sucesión convergente de reales tiene su límite también en ℝ. Esa propiedad de no tener huecos es la completitud, y es lo que hace a ℝ el escenario natural del análisis, el cálculo y, por extensión, todo el machine learning.",
    development: [
      {
        label: "Construcciones formales de ℝ",
        body: "Existen dos construcciones clásicas que parten de $\\mathbb{Q}$:\n\n**Cortaduras de Dedekind (1872).** Una cortadura es un par $(A, B)$ con $A \\cup B = \\mathbb{Q}$, $A \\cap B = \\emptyset$, $A \\neq \\emptyset \\neq B$, $A$ sin máximo, y $\\forall a \\in A, b \\in B: a < b$. Cada real se identifica con una cortadura:\n$$\\sqrt{2} \\;\\longleftrightarrow\\; A = \\{q \\in \\mathbb{Q} : q < 0 \\text{ ó } q^2 < 2\\}$$\n\n**Sucesiones de Cauchy (Cantor, 1872).** $\\mathbb{R}$ se construye como el cociente $\\mathcal{C}(\\mathbb{Q}) / {\\sim}$, donde $\\mathcal{C}(\\mathbb{Q})$ son las sucesiones de Cauchy en $\\mathbb{Q}$ y $(a_n) \\sim (b_n) \\iff \\lim_{n\\to\\infty}|a_n - b_n| = 0$. Ambas construcciones producen estructuras isomorfas."
      },
      {
        label: "Representación posicional y punto flotante",
        body: "Todo $x \\in \\mathbb{R}$ admite expansión decimal (base $\\beta$):\n$$x = \\pm \\sum_{k=-\\infty}^{N} d_k \\,\\beta^k, \\quad d_k \\in \\{0, 1, \\ldots, \\beta - 1\\}$$\nEn cómputo, los reales se aproximan mediante **números de punto flotante** (IEEE 754):\n$$\\text{fl}(x) = (-1)^s \\cdot m \\cdot \\beta^{e}, \\quad m \\in [1, \\beta),\\; e \\in [e_{\\min}, e_{\\max}]$$\nEl error de redondeo unitario $\\mathbf{u} = \\frac{1}{2}\\beta^{1-p}$ (con $p$ dígitos de mantisa) acota el error relativo: $|\\text{fl}(x) - x| \\leq \\mathbf{u}\\,|x|$. En `float64`: $\\mathbf{u} \\approx 1.11 \\times 10^{-16}$."
      },
      {
        label: "Topología de ℝ y completitud métrica",
        body: "$(\\mathbb{R}, |\\cdot|)$ es un **espacio métrico completo**: toda sucesión de Cauchy converge en $\\mathbb{R}$:\n$$\\forall\\,\\varepsilon > 0,\\; \\exists\\, N \\in \\mathbb{N} : m,n > N \\implies |a_m - a_n| < \\varepsilon \\;\\Longrightarrow\\; \\exists\\, L \\in \\mathbb{R}: a_n \\to L$$\nPor el **Teorema de Bolzano-Weierstrass**, toda sucesión acotada en $\\mathbb{R}$ tiene una subsucesión convergente. Los conjuntos abiertos generan la topología usual, y $\\mathbb{R}$ es un espacio separable (base numerable: intervalos con extremos racionales), localmente compacto pero no compacto."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "Los reales son el sustrato de toda la maquinaria de ML/DL:\n\n**Parámetros y gradientes.** Los pesos de una red neuronal $\\theta \\in \\mathbb{R}^p$ viven en un espacio euclídeo real; la retropropagación calcula $\\nabla_\\theta \\mathcal{L} \\in \\mathbb{R}^p$ explotando la diferenciabilidad de $\\mathbb{R}$.\n\n**Precisión numérica.** En la práctica se usan `float32` ($\\mathbf{u} \\approx 6 \\times 10^{-8}$) y, cada vez más, `bfloat16` o `float16` para eficiencia en GPU. El error de redondeo acumulado puede desestabilizar el entrenamiento, de ahí técnicas como **mixed precision** y **gradient scaling**.\n\n**Funciones de activación.** ReLU, sigmoid, tanh son funciones $f: \\mathbb{R} \\to \\mathbb{R}$ cuyas propiedades (monotonicidad, Lipschitzianidad, diferenciabilidad casi en todo punto) determinan la dinámica de optimización.\n\n**Log-sum-exp y estabilidad.** El truco $\\log\\sum_i e^{x_i} = x^* + \\log\\sum_i e^{x_i - x^*}$ con $x^* = \\max_i x_i$ evita overflow/underflow en aritmética de punto flotante, aplicado en softmax y cálculo de log-verosimilitudes."
      },
    ],
    code: `import numpy as np
import sys

# ── 1. Tipos de punto flotante en NumPy ───────────────────────────────────────
for dtype in [np.float16, np.float32, np.float64, np.longdouble]:
    info = np.finfo(dtype)
    print(f"{str(dtype.__name__):>12s} | eps={info.eps:.3e} | "
          f"max={info.max:.3e} | bits={info.bits}")

# ── 2. Propiedad arquimediana ─────────────────────────────────────────────────
x = 1e-15
n = 1
while n <= x:          # busca n ∈ ℕ tal que n > x
    n += 1
print(f"\\nArquimediana: para x={x}, se cumple n={n} > x → {n > x}")

# ── 3. Densidad de Q en R ─────────────────────────────────────────────────────
from fractions import Fraction

def racional_entre(a: float, b: float) -> Fraction:
    """Devuelve un racional q con a < q < b usando mediante de Stern-Brocot."""
    fa, fb = Fraction(a).limit_denominator(10**6), Fraction(b).limit_denominator(10**6)
    return (fa + fb) / 2

a, b = np.pi, np.pi + 1e-6
q = racional_entre(a, b)
print(f"\\nDensidad de Q: entre {a:.10f} y {b:.10f}")
print(f"  Racional hallado: {q} ≈ {float(q):.10f}")
print(f"  ¿Está en (a,b)? {a < float(q) < b}")

# ── 4. Error de representación en float64 ─────────────────────────────────────
x_exact = np.sqrt(2)          # irracional: no representable exactamente
u = np.finfo(np.float64).eps / 2   # error de redondeo unitario
print(f"\\nsqrt(2) en float64 : {x_exact!r}")
print(f"Error unitario u    : {u:.3e}")
print(f"Verificación x²     : {x_exact**2!r}  (debería ser 2.0)")

# ── 5. Sucesión de Cauchy → límite en R ──────────────────────────────────────
# Sucesión: a_n = (1 + 1/n)^n  → e
cauchy = [(1 + 1/n)**n for n in range(1, 500)]
limite = cauchy[-1]
print(f"\\n(1+1/n)^n → {limite:.10f}  |  e = {np.e:.10f}  |  error = {abs(limite-np.e):.2e}")

# ── 6. Truco log-sum-exp (estabilidad numérica) ───────────────────────────────
def log_sum_exp_naive(x: np.ndarray) -> float:
    return np.log(np.sum(np.exp(x)))      # puede dar inf/nan

def log_sum_exp_stable(x: np.ndarray) -> float:
    x_star = np.max(x)
    return x_star + np.log(np.sum(np.exp(x - x_star)))   # numéricamente seguro

x = np.array([1000.0, 1001.0, 1002.0])
print(f"\\nlog-sum-exp naive  : {log_sum_exp_naive(x)}")    # inf
print(f"log-sum-exp estable: {log_sum_exp_stable(x):.6f}") # correcto
`,
    related: ["Sistema de Punto Flotante", "Completitud Métrica", "Número Complejo", "Axioma del Supremo", "Épsilon-Delta"],
    hasViz: true,
    vizType: "numeroReal",
  },
  {
    id: 2,
    section: "I. Fundamentos Numéricos y Funcionales",
    sectionCode: "I",
    name: "Número Complejo",
    tags: ["álgebra", "cuerpo", "forma polar", "euler", "análisis complejo"],
    definition: "Un número complejo es un elemento del cuerpo ℂ, extensión algebraica de ℝ obtenida al adjuntar la unidad imaginaria i con la propiedad i² = −1. Todo z ∈ ℂ se escribe como z = a + bi con a, b ∈ ℝ, y ℂ es algebraicamente cerrado: todo polinomio no constante con coeficientes en ℂ tiene al menos una raíz en ℂ (Teorema Fundamental del Álgebra).",
    formal: {
      notation: "Sea $z \\in \\mathbb{C}$, $z = a + bi$ con $a = \\operatorname{Re}(z) \\in \\mathbb{R}$, $b = \\operatorname{Im}(z) \\in \\mathbb{R}$, $i^2 = -1$",
      body: "\\mathbb{C} := \\mathbb{R}[x] / \\langle x^2 + 1 \\rangle \\;\\cong\\; \\left\\{\\, a + bi \\;\\middle|\\; a, b \\in \\mathbb{R},\\; i^2 = -1 \\,\\right\\} \\\\ \\text{con operaciones:} \\\\ \\quad (a+bi)+(c+di) = (a+c)+(b+d)i \\\\ \\quad (a+bi)(c+di) = (ac-bd)+(ad+bc)i \\\\ \\text{Módulo: } |z| = \\sqrt{a^2+b^2} \\in \\mathbb{R}_{\\geq 0} \\qquad \\text{Conjugado: } \\bar{z} = a - bi \\\\ \\text{Inverso multiplicativo: } z^{-1} = \\dfrac{\\bar{z}}{|z|^2}, \\quad z \\neq 0",
      geometric: "z = |z|\\,e^{i\\theta} = |z|(\\cos\\theta + i\\sin\\theta), \\quad \\theta = \\arg(z) = \\operatorname{atan2}(b,\\,a) \\in (-\\pi, \\pi] \\\\ z_1 z_2 = |z_1||z_2|\\,e^{i(\\theta_1+\\theta_2)} \\quad \\text{(multiplicar = escalar y rotar)}",
      properties: [
        "\\text{Clausura algebraica: } \\forall\\, p \\in \\mathbb{C}[x],\\; \\deg p \\geq 1 \\implies \\exists\\, z_0 \\in \\mathbb{C}: p(z_0)=0",
        "\\text{Identidad de Euler: } e^{i\\pi} + 1 = 0 \\quad \\Longleftarrow \\quad e^{i\\theta} = \\cos\\theta + i\\sin\\theta",
        "\\text{Fórmula de De Moivre: } (\\cos\\theta+i\\sin\\theta)^n = \\cos(n\\theta)+i\\sin(n\\theta),\\quad n \\in \\mathbb{Z}",
      ],
    },
    intuition: "Mientras los reales viven en una recta, los complejos habitan el plano: la parte real es el eje horizontal, la imaginaria el vertical. Multiplicar por $z = |z|e^{i\\theta}$ es una transformación lineal que **escala** por $|z|$ y **rota** por $\\theta$. Eso convierte a $\\mathbb{C}$ en el lenguaje natural de ondas, rotaciones y frecuencias — la base de la Transformada de Fourier y de los embeddings rotatorios en Transformers.",
    development: [
      {
        label: "Construcción algebraica y estructura de cuerpo",
        body: "La construcción rigurosa parte del anillo de polinomios $\\mathbb{R}[x]$ y el ideal maximal $\\langle x^2+1 \\rangle$ (maximal porque $x^2+1$ es irreducible sobre $\\mathbb{R}$):\n\n$$\\mathbb{C} := \\mathbb{R}[x]/\\langle x^2+1\\rangle$$\n\nEl elemento $i := [x]$ satisface $i^2 = [x^2] = [-1] = -1$. Como cociente de un anillo commutativo por un ideal maximal, $\\mathbb{C}$ es un **cuerpo**. Toda extensión algebraica de $\\mathbb{R}$ de grado $> 1$ es isomorfa a $\\mathbb{C}$ — en sentido preciso, $\\mathbb{C}$ es la **clausura algebraica** de $\\mathbb{R}$.\n\nComo espacio vectorial real, $\\mathbb{C} \\cong \\mathbb{R}^2$ con base $\\{1, i\\}$. La multiplicación por $z = a+bi$ corresponde a la transformación lineal:\n$$M_z = \\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix} \\in \\mathbb{R}^{2\\times 2}$$\ncuyo determinante es $a^2 + b^2 = |z|^2$."
      },
      {
        label: "Geometría: plano de Argand y forma polar",
        body: "Identificar $z = a + bi \\leftrightarrow (a, b) \\in \\mathbb{R}^2$ define el **plano de Argand-Gauss**. La distancia euclidiana coincide con el módulo: $d(z_1, z_2) = |z_1 - z_2|$, haciendo de $\\mathbb{C}$ un espacio métrico completo.\n\nLa **forma polar** aprovecha coordenadas polares:\n$$z = r\\,e^{i\\theta}, \\quad r = |z| \\geq 0,\\quad \\theta = \\arg(z)$$\n\nEl producto en forma polar es especialmente limpio:\n$$z_1 z_2 = r_1 r_2\\, e^{i(\\theta_1+\\theta_2)}$$\n\nGeométricamente: **módulos se multiplican, argumentos se suman**. Las raíces $n$-ésimas de la unidad, $\\omega_k = e^{2\\pi i k/n}$ con $k = 0, \\ldots, n-1$, son los vértices de un polígono regular de $n$ lados inscrito en el círculo unitario $|z| = 1$, y son fundamentales en la **Transformada Discreta de Fourier**."
      },
      {
        label: "Análisis complejo: diferenciabilidad y ecuaciones de Cauchy-Riemann",
        body: "Una función $f: \\mathbb{C} \\to \\mathbb{C}$ es **holomorfa** (complejo-diferenciable) en $z_0$ si existe:\n$$f'(z_0) = \\lim_{h \\to 0} \\frac{f(z_0 + h) - f(z_0)}{h}, \\quad h \\in \\mathbb{C}$$\n\nEscribiendo $f = u + iv$ con $u, v: \\mathbb{R}^2 \\to \\mathbb{R}$, la holomorfía equivale a las **ecuaciones de Cauchy-Riemann**:\n$$\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y}, \\qquad \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}$$\n\nUna función holomorfa en todo $\\mathbb{C}$ se llama **entera**. El Teorema de Liouville establece que toda función entera acotada es constante — consecuencia del cual se deduce el Teorema Fundamental del Álgebra."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "Los números complejos aparecen de forma directa y profunda en ML/DL:\n\n**Transformada de Fourier y señales.** La DFT de una señal $x_0, \\ldots, x_{N-1} \\in \\mathbb{R}$ produce coeficientes $X_k \\in \\mathbb{C}$:\n$$X_k = \\sum_{n=0}^{N-1} x_n\\, e^{-2\\pi i kn/N}$$\nLa FFT lo computa en $\\mathcal{O}(N \\log N)$ en lugar de $\\mathcal{O}(N^2)$, y es la base de modelos de audio como WaveNet y Whisper.\n\n**Rotary Position Embeddings (RoPE).** En Transformers modernos (LLaMA, Gemini), la atención incorpora posición multiplicando los embeddings de consulta/clave por rotaciones complejas:\n$$f(\\mathbf{q}, m) = \\mathbf{q}\\, e^{im\\theta}$$\naquí $m$ es la posición del token y $\\theta$ un vector de frecuencias. La rotación compleja garantiza que el producto interno $\\langle f(\\mathbf{q},m),\\, f(\\mathbf{k},n)\\rangle$ depende solo de la distancia relativa $m - n$.\n\n**Redes neuronales complejas.** Existen variantes de redes con pesos $W \\in \\mathbb{C}^{m\\times n}$, útiles en procesamiento de señales de radar y MRI, donde la fase de la señal contiene información crítica que los reales descartan."
      },
    ],
    code: `import numpy as np
import cmath

# ── 1. Aritmética básica en ℂ ─────────────────────────────────────────────────
z1 = complex(3, 4)      # 3 + 4i
z2 = complex(1, -2)     # 1 - 2i

print(f"z1 = {z1},  z2 = {z2}")
print(f"Suma        : {z1 + z2}")
print(f"Producto    : {z1 * z2}")
print(f"Módulo |z1| : {abs(z1):.6f}")          # √(9+16) = 5
print(f"Conjugado   : {z1.conjugate()}")
print(f"Inverso z1⁻¹: {1/z1:.6f}")
print(f"z1 * conj   : {z1 * z1.conjugate()}")  # = |z1|² ∈ ℝ

# ── 2. Forma polar ────────────────────────────────────────────────────────────
r, theta = cmath.polar(z1)
print(f"\\nForma polar z1: r={r:.4f}, θ={theta:.4f} rad ({np.degrees(theta):.2f}°)")
z1_reconstruido = cmath.rect(r, theta)
print(f"Reconstruido  : {z1_reconstruido}")

# ── 3. Identidad de Euler y raíces de la unidad ───────────────────────────────
print(f"\\ne^(iπ) + 1   : {cmath.exp(1j * np.pi) + 1:.2e}")  # ≈ 0

n = 8
raices = [cmath.rect(1, 2 * np.pi * k / n) for k in range(n)]
print(f"\\nRaíces {n}-ésimas de la unidad:")
for k, w in enumerate(raices):
    print(f"  ω_{k} = {w.real:+.4f} {w.imag:+.4f}i  |  arg = {np.degrees(cmath.phase(w)):+.1f}°")

# ── 4. Representación matricial de ℂ ─────────────────────────────────────────
def complejo_a_matriz(z: complex) -> np.ndarray:
    """Isomorfismo ℂ → M₂(ℝ): z = a+bi ↦ [[a,-b],[b,a]]"""
    a, b = z.real, z.imag
    return np.array([[a, -b], [b, a]])

Mz1 = complejo_a_matriz(z1)
Mz2 = complejo_a_matriz(z2)
print(f"\\nM_z1 =\\n{Mz1}")
print(f"det(M_z1) = {np.linalg.det(Mz1):.1f}  (debería ser |z1|²={abs(z1)**2:.1f})")
print(f"M_z1 @ M_z2 vs complejo_a_matriz(z1*z2):")
print(np.allclose(Mz1 @ Mz2, complejo_a_matriz(z1 * z2)))  # True

# ── 5. DFT manual usando exponenciales complejas ──────────────────────────────
def dft(x: np.ndarray) -> np.ndarray:
    N = len(x)
    n = np.arange(N)
    k = n.reshape((N, 1))
    W = np.exp(-2j * np.pi * k * n / N)   # matriz de Vandermonde compleja
    return W @ x

x = np.array([1, 2, 3, 4], dtype=complex)
X_manual = dft(x)
X_numpy  = np.fft.fft(x)
print(f"\\nDFT manual  : {X_manual}")
print(f"NumPy FFT   : {X_numpy}")
print(f"Coinciden   : {np.allclose(X_manual, X_numpy)}")

# ── 6. RoPE — Rotary Position Embedding (mini-demo) ──────────────────────────
def rope(q: np.ndarray, pos: int, theta_base: float = 10000.0) -> np.ndarray:
    """
    Aplica RoPE a un vector de query q ∈ ℝ^d interpretando pares como ℂ.
    q_rot[2k] + i*q_rot[2k+1] = (q[2k] + i*q[2k+1]) * e^{i * pos / theta_base^(2k/d)}
    """
    d = len(q)
    assert d % 2 == 0
    q_complex = q[::2] + 1j * q[1::2]          # d/2 números complejos
    freqs = pos / theta_base ** (np.arange(d // 2) * 2 / d)
    rotations = np.exp(1j * freqs)
    q_rot = q_complex * rotations
    out = np.empty(d)
    out[::2]  = q_rot.real
    out[1::2] = q_rot.imag
    return out

np.random.seed(42)
q = np.random.randn(8)
print(f"\\nRoPE pos=0 : {rope(q, 0).round(4)}")   # sin rotación → igual que q
print(f"RoPE pos=1 : {rope(q, 1).round(4)}")
print(f"‖q‖ = ‖rope(q,1)‖ ? {np.allclose(np.linalg.norm(q), np.linalg.norm(rope(q,1)))}")
`,
    related: ["Número Real", "Transformada de Fourier", "Rotary Position Embedding", "Álgebra Lineal Compleja", "Ecuaciones de Cauchy-Riemann"],
    hasViz: true,
    vizType: "numeroComplejo",
  },
  {
    id: 3,
    section: "I. Fundamentos Numéricos y Funcionales",
    sectionCode: "I",
    name: "Campo (Álgebra)",
    tags: ["álgebra abstracta", "estructura algebraica", "cuerpo", "axiomas", "fundamentos"],
    definition: "Un campo (o cuerpo) es una estructura algebraica (F, +, ·) en la que F es un conjunto no vacío dotado de dos operaciones binarias que satisfacen los axiomas de cuerpo: (F, +) es un grupo abeliano, (F\\{0}, ·) es un grupo abeliano, y la multiplicación distribuye sobre la suma. Los campos son el escenario algebraico mínimo en que se puede hacer aritmética completa — sumar, restar, multiplicar y dividir (excepto por cero).",
    formal: {
      notation: "Sea $(F, +, \\cdot)$ un campo con identidad aditiva $0$ e identidad multiplicativa $1 \\neq 0$",
      body: "(F, +, \\cdot) \\text{ es un campo} \\iff \\text{se cumplen los 9 axiomas:} \\\\ \\quad \\textbf{A1. }\\text{Clausura: } a+b \\in F \\qquad \\textbf{A2. }\\text{Asociatividad: }(a+b)+c = a+(b+c) \\\\ \\quad \\textbf{A3. }\\text{Conmutatividad: } a+b = b+a \\qquad \\textbf{A4. }\\text{Identidad: } \\exists\\,0: a+0=a \\\\ \\quad \\textbf{A5. }\\text{Inverso aditivo: } \\exists\\,{-a}: a+(-a)=0 \\\\ \\quad \\textbf{M1--M4. }\\text{Análogos para } (F\\setminus\\{0\\}, \\cdot) \\text{ (grupo abeliano con identidad }1) \\\\ \\quad \\textbf{D. }\\text{Distributividad: } a\\cdot(b+c) = a\\cdot b + a\\cdot c \\\\ \\\\  \\text{Característica: } \\operatorname{char}(F) := \\min\\{n \\in \\mathbb{N}^+ : n\\cdot 1 = 0\\} \\text{ (0 si no existe tal }n\\text{)}",
      geometric: "F^n := \\underbrace{F \\times \\cdots \\times F}_{n} \\text{ es un espacio vectorial sobre } F \\text{ de dimensión } n \\\\ \\text{Todo espacio vectorial requiere que los escalares formen un campo}",
      properties: [
        "\\text{Unicidad de identidades y de inversos: } 0,\\,1,\\,-a,\\,a^{-1} \\text{ son únicos en } F",
        "\\text{Caract. prima o cero: } \\operatorname{char}(F) \\in \\{0\\} \\cup \\{p : p \\text{ primo}\\}",
        "\\text{Campos finitos (Galois): } |F| = p^n \\text{ para algún primo } p,\\; n \\in \\mathbb{N}^+;\\text{ denotado } \\mathbb{F}_{p^n} \\text{ o } GF(p^n)",
      ],
    },
    intuition: "Un campo es el sistema numérico más completo posible: puedes sumar, restar, multiplicar y siempre dividir (salvo por cero), y las reglas son exactamente las que conoces de $\\mathbb{Q}$, $\\mathbb{R}$ o $\\mathbb{C}$. Pensa en él como la 'licencia mínima' que deben tener los escalares para que el álgebra lineal funcione: sin campo no hay espacio vectorial, sin espacio vectorial no hay álgebra lineal, y sin álgebra lineal no hay ML.",
    development: [
      {
        label: "Jerarquía de estructuras algebraicas",
        body: "Un campo es la estructura algebraica más rica de la jerarquía clásica. Cada nivel añade axiomas al anterior:\n\n$$\\text{Magma} \\subsetneq \\text{Semigrupo} \\subsetneq \\text{Monoide} \\subsetneq \\text{Grupo} \\subsetneq \\text{Grupo abeliano}$$\n\n$$\\text{Anillo} \\subsetneq \\text{Anillo conmutativo} \\subsetneq \\text{Dominio íntegro} \\subsetneq \\text{Campo}$$\n\nUn **anillo** $(R, +, \\cdot)$ exige que $(R,+)$ sea grupo abeliano y que $\\cdot$ sea asociativa y distributiva, pero no requiere inversos multiplicativos ni conmutatividad del producto. Un **dominio íntegro** añade conmutatividad, identidad multiplicativa $1 \\neq 0$, y ausencia de divisores de cero ($ab=0 \\Rightarrow a=0$ o $b=0$). Un **campo** añade que todo elemento no nulo tiene inverso multiplicativo."
      },
      {
        label: "Campos fundamentales y sus características",
        body: "Los campos más importantes en matemáticas y computación son:\n\n| Campo | $\\operatorname{char}$ | Cardinalidad | Notas |\n|---|---|---|---|\n| $\\mathbb{Q}$ | $0$ | $\\aleph_0$ | Mínimo campo de característica 0 |\n| $\\mathbb{R}$ | $0$ | $2^{\\aleph_0}$ | Único cuerpo arquimediano completo |\n| $\\mathbb{C}$ | $0$ | $2^{\\aleph_0}$ | Algebraicamente cerrado |\n| $\\mathbb{F}_2 = \\{0,1\\}$ | $2$ | $2$ | Base de la aritmética booleana |\n| $\\mathbb{F}_p$ | $p$ primo | $p$ | Enteros módulo $p$ |\n| $\\mathbb{F}_{p^n}$ | $p$ primo | $p^n$ | Campo de Galois |\n\nLa característica determina la aritmética fundamental: en $\\mathbb{F}_2$, $1+1=0$, lo que elimina la mitad de las operaciones familiares. Todo campo de característica $0$ contiene una copia de $\\mathbb{Q}$; todo campo de característica $p$ contiene una copia de $\\mathbb{F}_p$."
      },
      {
        label: "Extensiones de campo y polinomios",
        body: "Dado un campo $F$ y un polinomio irreducible $p(x) \\in F[x]$ de grado $n$, el cociente:\n$$E = F[x]/\\langle p(x) \\rangle$$\nes una **extensión de campo** de grado $[E:F] = n$. Es exactamente la construcción que produce $\\mathbb{C}$ desde $\\mathbb{R}$ (con $p(x)=x^2+1$) y los campos de Galois $\\mathbb{F}_{p^n}$ desde $\\mathbb{F}_p$.\n\nEl **Teorema de la base primitiva** garantiza que $\\mathbb{F}_{p^n}^\\times = \\mathbb{F}_{p^n}\\setminus\\{0\\}$ es un grupo cíclico: existe $g \\in \\mathbb{F}_{p^n}$ (elemento primitivo) tal que:\n$$\\mathbb{F}_{p^n}^\\times = \\{g^0, g^1, g^2, \\ldots, g^{p^n-2}\\}$$\n\nEsta estructura cíclica es la base de la criptografía de curva elíptica y de los códigos correctores de errores Reed-Solomon."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "El concepto de campo es el fundamento silencioso de toda la maquinaria matemática del ML:\n\n**Álgebra lineal sobre ℝ.** Todo el álgebra lineal del ML — matrices de pesos, gradientes, descomposiciones SVD/QR — ocurre sobre $\\mathbb{R}$, que es un campo. Sin la propiedad de inversión multiplicativa no existiría la matriz inversa, los sistemas $Ax=b$ no tendrían solución única, ni habría descomposiciones espectrales.\n\n**Aritmética modular y criptografía.** Los transformers modernos se despliegan en entornos donde la privacidad importa. Técnicas como *Federated Learning* con *Secure Aggregation* emplean campos finitos $\\mathbb{F}_p$ (o sus extensiones) para computación multipartita segura: los gradientes se codifican en $\\mathbb{F}_p$, se agregan módulo $p$, y se decodifican sin revelar valores individuales.\n\n**Códigos de Galois y confiabilidad.** Los códigos Reed-Solomon, construidos sobre $\\mathbb{F}_{2^8}$ (los bytes de un ordenador), protegen datos en almacenamiento distribuido (RAID, Google Colossus). Sus propiedades dependen directamente de que $\\mathbb{F}_{2^8}$ sea un campo: la existencia de inversos garantiza la corrección de errores.\n\n**Cuantización y campos finitos.** La cuantización de modelos (int8, int4) trabaja en $\\mathbb{Z}/2^k\\mathbb{Z}$, que **no** es un campo (hay divisores de cero). Este es precisamente el origen de los errores numéricos en inferencia cuantizada: la estructura algebraica se degrada de campo a anillo."
      },
    ],
    code: `from __future__ import annotations
from typing import Any
import numpy as np

# ── 1. Campo F_p: aritmética modular sobre enteros módulo primo p ─────────────
class Fp:
    """Elemento del campo F_p = Z/pZ para p primo."""
    def __init__(self, val: int, p: int):
        assert self._es_primo(p), f"{p} no es primo"
        self.p = p
        self.val = int(val) % p

    @staticmethod
    def _es_primo(n: int) -> bool:
        if n < 2: return False
        return all(n % i != 0 for i in range(2, int(n**0.5)+1))

    def __add__(self, other: Fp) -> Fp:  return Fp(self.val + other.val, self.p)
    def __sub__(self, other: Fp) -> Fp:  return Fp(self.val - other.val, self.p)
    def __mul__(self, other: Fp) -> Fp:  return Fp(self.val * other.val, self.p)
    def __neg__(self)            -> Fp:  return Fp(-self.val, self.p)

    def __truediv__(self, other: Fp) -> Fp:
        # Inverso multiplicativo por pequeño teorema de Fermat: a^{p-2} mod p
        if other.val == 0:
            raise ZeroDivisionError("División por cero en F_p")
        inv = pow(other.val, self.p - 2, self.p)
        return Fp(self.val * inv, self.p)

    def __repr__(self) -> str:
        return f"{self.val} (mod {self.p})"
    def __eq__(self, other: Any) -> bool:
        return isinstance(other, Fp) and self.val == other.val and self.p == other.p

# Demo F_7
p = 7
a, b = Fp(3, p), Fp(5, p)
print(f"=== Campo F_{p} ===")
print(f"a = {a},  b = {b}")
print(f"a + b = {a + b}")
print(f"a * b = {a * b}")
print(f"a / b = {a / b}")   # 3 * 5^{-1} mod 7 = 3*3 = 9 = 2
print(f"Verificación (a/b)*b = {(a/b)*b}")  # debe dar a = 3

# ── 2. Tabla de multiplicar de F_5 ───────────────────────────────────────────
p = 5
print(f"\\n=== Tabla multiplicativa de F_{p} (elementos no nulos) ===")
elems = list(range(1, p))
header = "   " + "  ".join(f"{e}" for e in elems)
print(header)
for i in elems:
    row = f"{i} | " + "  ".join(
        str(Fp(i, p) * Fp(j, p)).split()[0] for j in elems
    )
    print(row)

# ── 3. Verificar axiomas de campo sobre F_p ───────────────────────────────────
def verificar_axiomas_campo(p: int) -> dict[str, bool]:
    elems = [Fp(v, p) for v in range(p)]
    ne    = [Fp(v, p) for v in range(1, p)]  # no nulos

    cero = Fp(0, p); uno = Fp(1, p)

    resultados = {}
    # A4: identidad aditiva
    resultados["Identidad aditiva (a+0=a)"] = all(
        a + cero == a for a in elems)
    # A5: inverso aditivo
    resultados["Inverso aditivo (a+(-a)=0)"] = all(
        a + (-a) == cero for a in elems)
    # A3: conmutatividad suma
    resultados["Conmutatividad +"] = all(
        a + b == b + a for a in elems for b in elems)
    # M4: inverso multiplicativo
    resultados["Inverso mult. (a·a⁻¹=1)"] = all(
        a * (uno / a) == uno for a in ne)
    # D: distributividad
    resultados["Distributividad"] = all(
        a * (b + c) == a*b + a*c
        for a in elems for b in elems for c in elems)
    return resultados

print("\\n=== Verificación axiomas F_7 ===")
for axioma, ok in verificar_axiomas_campo(7).items():
    print(f"  {'✓' if ok else '✗'} {axioma}")

# ── 4. Campo de Galois F_{2^8} (byte arithmetic) ─────────────────────────────
# Usado en AES y códigos Reed-Solomon
# Polinomio irreducible: x^8 + x^4 + x^3 + x + 1 (= 0x11B en AES)
AES_POLY = 0x11B

def gf256_mul(a: int, b: int) -> int:
    """Multiplicación en GF(2^8) con reducción módulo AES_POLY."""
    result = 0
    while b:
        if b & 1:
            result ^= a           # suma en GF(2) es XOR
        a <<= 1
        if a & 0x100:
            a ^= AES_POLY         # reducción modular
        b >>= 1
    return result & 0xFF

def gf256_inv(a: int) -> int:
    """Inverso multiplicativo en GF(2^8) por exponenciación: a^{254}."""
    if a == 0: raise ZeroDivisionError
    result = 1
    exp = 254  # p^n - 2 = 256 - 2
    base = a
    while exp:
        if exp & 1:
            result = gf256_mul(result, base)
        base = gf256_mul(base, base)
        exp >>= 1
    return result

a_byte, b_byte = 0x53, 0xCA
prod = gf256_mul(a_byte, b_byte)
inv_a = gf256_inv(a_byte)
print(f"\\n=== GF(2^8) — aritmética de bytes ===")
print(f"0x{a_byte:02X} × 0x{b_byte:02X} = 0x{prod:02X}")
print(f"0x{a_byte:02X}⁻¹ = 0x{inv_a:02X}")
print(f"Verificación: 0x{a_byte:02X} × 0x{inv_a:02X} = 0x{gf256_mul(a_byte, inv_a):02X}  (debe ser 0x01)")

# ── 5. Z/6Z NO es campo (divisores de cero) ───────────────────────────────────
print("\\n=== ¿Por qué Z/6Z no es campo? ===")
for a in range(1, 6):
    for b in range(1, 6):
        if (a * b) % 6 == 0:
            print(f"  Divisor de cero: {a} × {b} ≡ 0 (mod 6) → no hay inverso de {a}")
            break
`,
    related: ["Número Real", "Número Complejo", "Espacio Vectorial", "Anillo", "Campo de Galois"],
    hasViz: true,
    vizType: "campoAlgebra",
  },
  {
    id: 4,
    section: "I. Fundamentos Numéricos y Funcionales",
    sectionCode: "I",
    name: "Variable",
    tags: ["fundamentos", "lógica matemática", "estadística", "notación", "tipos de datos"],
    definition: "Una variable es un símbolo que actúa como marcador de posición para un elemento no especificado de un conjunto dado, llamado dominio o universo de discurso. Según el contexto, puede representar una incógnita (álgebra), un argumento de una función (análisis), una cantidad aleatoria con distribución de probabilidad (estadística) o un parámetro entrenable (ML). La distinción entre variable libre y ligada, y entre variable aleatoria y determinista, es fundamental para la precisión formal.",
    formal: {
      notation: "Sea $x$ una variable con dominio $\\mathcal{X}$; se escribe $x \\in \\mathcal{X}$",
      body: "\\textbf{Variable determinista: } x \\in \\mathcal{X} \\text{ — símbolo ligado a un dominio, sin distribución} \\\\ \\textbf{Variable aleatoria (discreta): } X : \\Omega \\to \\mathcal{X}, \\text{ medible respecto de } (\\Omega, \\mathcal{F}, P) \\\\ \\quad P(X = x_k) = p_k \\geq 0, \\quad \\sum_{k} p_k = 1 \\\\ \\textbf{Variable aleatoria (continua): } f_X : \\mathcal{X} \\to \\mathbb{R}_{\\geq 0}, \\quad \\int_{\\mathcal{X}} f_X(x)\\,dx = 1 \\\\ \\textbf{Variable ligada vs libre: } \\sum_{x=1}^{n} x^2 \\;\\text{(ligada)}\\quad\\text{vs}\\quad f(x) = x^2\\;\\text{(libre)}",
      geometric: "\\mathcal{X} \\subseteq \\mathbb{R}^d \\text{ — el dominio define la geometría del espacio de valores:} \\\\ \\text{escalar } (d=1),\\text{ vector } (d>1),\\text{ categórico } (\\mathcal{X} = \\{c_1,\\ldots,c_k\\}),\\text{ funcional } (\\mathcal{X} = L^2)",
      properties: [
        "\\text{Tipo escalar: } x \\in \\mathbb{R} \\text{ (o } \\mathbb{C}, \\mathbb{Z}, \\mathbb{F}_p\\text{)} — \\text{dimensión } d=1",
        "\\text{Tipo vectorial: } \\mathbf{x} \\in \\mathbb{R}^d,\\; d > 1 — \\text{base del álgebra lineal en ML}",
        "\\text{Variable aleatoria: } \\mathbb{E}[X] = \\int x\\,dP_X(x),\\quad \\operatorname{Var}(X) = \\mathbb{E}[(X-\\mathbb{E}[X])^2]",
      ],
    },
    intuition: "Una variable es una 'caja con etiqueta': la etiqueta es el nombre ($x$, $\\theta$, $\\mathbf{w}$) y la caja puede contener cualquier valor de su dominio. En álgebra la caja tiene un valor fijo pero desconocido; en análisis la caja se mueve por su dominio; en estadística la caja tiene un mecanismo aleatorio que decide qué valor toma. En ML conviven los tres roles simultáneamente: $\\mathbf{x}$ es el dato (fijo para cada muestra), $\\theta$ es el parámetro (fijo pero desconocido, a estimar) y $\\hat{y}$ es la predicción (función de ambos).",
    development: [
      {
        label: "Taxonomía de variables por dominio y rol",
        body: "Las variables se clasifican a lo largo de varios ejes ortogonales:\n\n**Por tipo de dominio:**\n- *Continua*: $x \\in \\mathbb{R}$ o $\\mathbf{x} \\in \\mathbb{R}^d$. Admite derivación e integración.\n- *Discreta*: $x \\in \\mathbb{Z}$, $x \\in \\{0,1,\\ldots,K-1\\}$. Operaciones de suma finita.\n- *Categórica*: $x \\in \\{\\text{gato, perro, pez}\\}$. Requiere codificación (*one-hot*, *embeddings*).\n- *Funcional*: $x \\in L^2([0,1])$. Variables cuyo 'valor' es una función; base del aprendizaje funcional.\n\n**Por rol lógico:**\n- *Libre*: ocurre sin cuantificador que la acote. En $f(x) = x^2$, $x$ es libre.\n- *Ligada*: cuantificada o indexada. En $\\sum_{i=1}^n x_i$, el índice $i$ está ligado.\n- *Parámetro*: libre pero tratada como constante en el contexto actual ($\\mu$ en $\\mathcal{N}(x;\\mu,\\sigma^2)$).\n\n**Por certeza:**\n$$\\underbrace{x \\in \\mathbb{R}^d}_{\\text{determinista}} \\qquad \\text{vs} \\qquad \\underbrace{X : (\\Omega,\\mathcal{F},P) \\to (\\mathbb{R}^d, \\mathcal{B}^d)}_{\\text{aleatoria (medible)}}$$"
      },
      {
        label: "Variable aleatoria: construcción formal",
        body: "Una **variable aleatoria** no es un número, sino una función medible entre espacios de medida. Dado el espacio de probabilidad $(\\Omega, \\mathcal{F}, P)$:\n$$X : \\Omega \\longrightarrow (\\mathcal{X}, \\mathcal{B}),\\quad X^{-1}(B) \\in \\mathcal{F}\\;\\forall B \\in \\mathcal{B}$$\n\nLa **ley** (o distribución) de $X$ es la medida de probabilidad inducida $P_X = P \\circ X^{-1}$ sobre $(\\mathcal{X}, \\mathcal{B})$. Sus momentos:\n$$\\mathbb{E}[g(X)] = \\int_\\Omega g(X(\\omega))\\,dP(\\omega) = \\int_{\\mathcal{X}} g(x)\\,dP_X(x)$$\n\nEl **soporte** de $X$ es $\\operatorname{supp}(P_X) = \\overline{\\{x : P_X(B(x,\\varepsilon)) > 0\\;\\forall\\varepsilon>0\\}}$. La distinción entre variable aleatoria y su *realización* $x = X(\\omega)$ es crítica: confundirlas es el origen de errores conceptuales frecuentes en ML."
      },
      {
        label: "Variables en lógica y lenguajes formales",
        body: "En lógica de primer orden, una variable es un término sin interpretación fija. La distinción libre/ligada determina el alcance de los cuantificadores:\n$$\\forall x\\;\\exists y:\\; x + y = 0 \\qquad (x,y \\text{ ligadas})$$\n$$\\text{vs}\\quad P(x) := x > 0 \\qquad (x \\text{ libre, }P\\text{ es un predicado})$$\n\nEn $\\lambda$-cálculo (fundamento de lenguajes funcionales y, por analogía, de redes neuronales como computación):\n$$\\lambda x.\\, (x + y) \\qquad x \\text{ ligada},\\; y \\text{ libre (variable libre = dependencia externa)}$$\n\nEsta distinción aparece en frameworks de ML: en PyTorch, las variables con `requires_grad=True` son 'libres' respecto al grafo computacional — el optimizador puede modificarlas; las demás son constantes (ligadas o fijas)."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "En ML coexisten simultáneamente cuatro roles de variable con semánticas distintas:\n\n**Variables de entrada** $\\mathbf{x} \\in \\mathbb{R}^d$: realizaciones de una variable aleatoria desconocida $X \\sim P_{\\text{data}}$. El objetivo del aprendizaje es aproximar propiedades de $P_{\\text{data}}$ a partir de muestras $\\{\\mathbf{x}^{(i)}\\}_{i=1}^n$.\n\n**Parámetros** $\\theta \\in \\mathbb{R}^p$: variables deterministas libres optimizadas por descenso de gradiente:\n$$\\theta \\leftarrow \\theta - \\eta\\,\\nabla_\\theta \\mathcal{L}(\\theta)$$\n\n**Variables latentes** $\\mathbf{z} \\in \\mathbb{R}^k$: variables aleatorias no observadas que codifican estructura oculta. En VAEs: $\\mathbf{z} \\sim \\mathcal{N}(\\boldsymbol{\\mu}_\\phi(\\mathbf{x}),\\, \\operatorname{diag}(\\boldsymbol{\\sigma}^2_\\phi(\\mathbf{x})))$.\n\n**Variables de atención** en Transformers: las matrices $Q, K, V \\in \\mathbb{R}^{n \\times d_k}$ son transformaciones lineales de la entrada — variables intermedias del grafo computacional cuya semántica emerge del entrenamiento.\n\n**Notación de Einstein** (convención de índices repetidos implican suma), frecuente en implementaciones tensorizadas:\n$$y_i = W_{ij}\\,x_j \\equiv \\sum_j W_{ij}\\,x_j \\qquad \\text{(einsum en NumPy/PyTorch)}$$"
      },
    ],
    code: `import numpy as np
from dataclasses import dataclass, field
from typing import Callable

# ── 1. Variable determinista vs aleatoria ────────────────────────────────────
print("=== Variables deterministas ===")
x_escalar  = 3.14                              # x ∈ ℝ
x_vector   = np.array([1.0, 2.0, 3.0])        # x ∈ ℝ³
x_matriz   = np.eye(3)                         # X ∈ ℝ^{3×3}
print(f"Escalar : {x_escalar}")
print(f"Vector  : {x_vector}")
print(f"Matriz  :\\n{x_matriz}")

print("\\n=== Variable aleatoria discreta ===")
# X ~ Categórica({0,1,2}, p=[0.1, 0.3, 0.6])
vals = np.array([0, 1, 2])
probs = np.array([0.1, 0.3, 0.6])
assert np.isclose(probs.sum(), 1.0)

media    = np.sum(vals * probs)
varianza = np.sum((vals - media)**2 * probs)
print(f"E[X]    = {media:.4f}")
print(f"Var(X)  = {varianza:.4f}")
muestras = np.random.choice(vals, size=10_000, p=probs)
print(f"Media empírica  (n=10k): {muestras.mean():.4f}  (esperado {media:.4f})")

print("\\n=== Variable aleatoria continua (Gaussiana) ===")
mu, sigma = 2.0, 1.5
X_muestras = np.random.normal(mu, sigma, size=10_000)
print(f"E[X] teórico={mu:.2f}, empírico={X_muestras.mean():.4f}")
print(f"Std  teórico={sigma:.2f}, empírico={X_muestras.std():.4f}")

# ── 2. Taxonomía de tipos de variable ────────────────────────────────────────
@dataclass
class Variable:
    nombre:   str
    dominio:  str
    rol:      str           # 'entrada', 'parámetro', 'latente', 'objetivo'
    grad:     bool = False  # ¿es entrenable?
    shape:    tuple = field(default_factory=lambda: ())

    def __repr__(self):
        g = "∇" if self.grad else " "
        return f"[{g}] {self.nombre:10s} ∈ {self.dominio:15s}  rol={self.rol}"

variables_nn = [
    Variable("x",      "ℝ^d",       "entrada",    grad=False, shape=(32, 768)),
    Variable("W_q",    "ℝ^{d×d_k}", "parámetro",  grad=True,  shape=(768, 64)),
    Variable("z",      "ℝ^k",       "latente",     grad=False, shape=(32, 64)),
    Variable("y_hat",  "ℝ^C",       "objetivo",    grad=False, shape=(32, 10)),
    Variable("theta",  "ℝ^p",       "parámetro",   grad=True,  shape=(1_000_000,)),
]
print("\\n=== Taxonomía de variables en una red neuronal ===")
for v in variables_nn:
    print(v)

# ── 3. Variable libre vs ligada (ejemplo funcional) ───────────────────────────
print("\\n=== Variable libre vs ligada ===")
# Variable libre: x en f(x) = x²
f: Callable[[float], float] = lambda x: x**2
print(f"f(3) = {f(3)}  — x es libre (argumento)")

# Variable ligada: i en Σ_{i=0}^{n-1} i²
n = 5
suma = sum(i**2 for i in range(n))   # i está ligada al bucle
print(f"Σ_{{i=0}}^{{{n-1}}} i² = {suma}  — i es ligada (cuantificada)")

# ── 4. Notación de Einstein con np.einsum ─────────────────────────────────────
print("\\n=== Notación de Einstein (einsum) ===")
np.random.seed(42)
W = np.random.randn(4, 3)   # W_{ij}  ∈ ℝ^{4×3}
x = np.random.randn(3)      # x_j     ∈ ℝ^3

# y_i = W_{ij} x_j  (suma implícita sobre j)
y_einsum = np.einsum("ij,j->i", W, x)
y_matmul = W @ x
print(f"einsum  y = Wx : {y_einsum.round(4)}")
print(f"matmul  y = Wx : {y_matmul.round(4)}")
print(f"Coinciden      : {np.allclose(y_einsum, y_matmul)}")

# Traza: T = W_{ii}  (contracción de índice libre a ligado)
A = np.random.randn(4, 4)
traza_einsum = np.einsum("ii->", A)
print(f"\\ntraza(A) einsum : {traza_einsum:.4f}")
print(f"traza(A) np      : {np.trace(A):.4f}")

# ── 5. Variable latente en un VAE (capa de muestreo) ─────────────────────────
print("\\n=== Variable latente z en VAE — reparametrización ===")
# z = μ + σ·ε,  ε ~ N(0,I)  — ε es la variable auxiliar (libre)
d_latente = 8
mu_z    = np.random.randn(d_latente)       # salida del encoder
log_var = np.random.randn(d_latente)       # log σ²
sigma_z = np.exp(0.5 * log_var)

eps = np.random.randn(d_latente)           # ε ~ N(0, I)
z   = mu_z + sigma_z * eps                # truco de reparametrización

print(f"μ(x)   = {mu_z.round(3)}")
print(f"σ(x)   = {sigma_z.round(3)}")
print(f"z      = {z.round(3)}")
print(f"‖z-μ‖  = {np.linalg.norm(z - mu_z):.4f}")
`,
    related: ["Función", "Variable Aleatoria", "Espacio Vectorial", "Tensor", "Parámetro y Estadístico"],
    hasViz: true,
    vizType: "variable",
  },
  {
    id: 5,
    section: "I. Fundamentos Numéricos y Funcionales",
    sectionCode: "I",
    name: "Función",
    tags: ["análisis", "mapeo", "dominio", "codominio", "composición", "fundamentos"],
    definition: "Una función es una correspondencia que asigna a cada elemento de un conjunto de partida (dominio) exactamente un elemento de un conjunto de llegada (codominio). Formalmente es una relación binaria con la propiedad de unicidad: si (x, y₁) y (x, y₂) pertenecen a la relación, entonces y₁ = y₂. Las funciones son el objeto matemático central del análisis, el álgebra y el aprendizaje automático: toda red neuronal es, en última instancia, una función parametrizada f_θ: ℝᵈ → ℝᵏ.",
    formal: {
      notation: "Sea $f: X \\to Y$ una función con dominio $X$, codominio $Y$, y regla de asignación $x \\mapsto f(x)$",
      body: "f \\subseteq X \\times Y \\text{ tal que } \\forall\\, x \\in X,\\; \\exists!\\, y \\in Y : (x, y) \\in f \\\\ \\text{Equivalentemente: } f : X \\to Y,\\quad x \\mapsto f(x) \\\\ \\textbf{Imagen: } \\operatorname{Im}(f) = f(X) = \\{f(x) : x \\in X\\} \\subseteq Y \\\\ \\textbf{Preimagen: } f^{-1}(B) = \\{x \\in X : f(x) \\in B\\},\\quad B \\subseteq Y \\\\ \\textbf{Composición: } (g \\circ f)(x) = g(f(x)),\\quad f: X\\to Y,\\; g: Y \\to Z",
      geometric: "\\textbf{Inyectiva: } f(x_1)=f(x_2) \\Rightarrow x_1=x_2 \\qquad \\textbf{Sobreyectiva: } f(X)=Y \\\\ \\textbf{Biyectiva: } \\text{inyectiva} \\land \\text{sobreyectiva} \\Rightarrow \\exists\\, f^{-1}: Y \\to X \\\\ \\textbf{Lipschitz: } \\exists\\, L\\geq 0:\\; \\|f(x_1)-f(x_2)\\| \\leq L\\|x_1-x_2\\|\\;\\forall x_1,x_2 \\in X",
      properties: [
        "\\text{Identidad: } \\operatorname{id}_X : X \\to X,\\; x \\mapsto x \\quad \\Rightarrow \\quad f \\circ \\operatorname{id}_X = \\operatorname{id}_Y \\circ f = f",
        "\\text{Asociatividad de } \\circ:\\; (h \\circ g) \\circ f = h \\circ (g \\circ f) \\quad (\\text{no conmuta en general})",
        "\\text{Teorema del valor intermedio: } f \\in C([a,b]),\\; f(a)<c<f(b) \\Rightarrow \\exists\\, \\xi \\in (a,b): f(\\xi)=c",
      ],
    },
    intuition: "Una función es una máquina con una ranura de entrada y una de salida: metes un elemento del dominio, sale exactamente uno del codominio. Lo que distingue a las funciones de una mera tabla de valores es la **regla** — una ley que describe cómo transformar la entrada. Una red neuronal no es más que una composición de funciones simples (afines + no lineales): $f_\\theta = \\sigma_L \\circ A_L \\circ \\cdots \\circ \\sigma_1 \\circ A_1$, donde cada $A_k(\\mathbf{x}) = W_k\\mathbf{x} + \\mathbf{b}_k$ y cada $\\sigma_k$ es una activación.",
    development: [
      {
        label: "Tipos de función y propiedades globales",
        body: "Las propiedades estructurales de una función determinan qué operaciones son posibles sobre ella:\n\n**Inyectividad** (uno a uno): $f(x_1) = f(x_2) \\Rightarrow x_1 = x_2$. Equivale a que $f^{-1}$ existe como función parcial. Ejemplo: $e^x: \\mathbb{R} \\to \\mathbb{R}_{>0}$.\n\n**Sobreyectividad** (sobre): $f(X) = Y$. Todo elemento del codominio tiene al menos una preimagen. Ejemplo: $\\sin: \\mathbb{R} \\to [-1,1]$.\n\n**Biyectividad**: inyectiva y sobreyectiva simultáneamente. Garantiza la existencia de inversa global $f^{-1}: Y \\to X$ con $f^{-1} \\circ f = \\operatorname{id}_X$.\n\n**Lipschitz continua** con constante $L$: controla cuánto puede 'variar' la salida respecto a la entrada. Es condición suficiente para la unicidad de puntos fijos (Banach) y para que el descenso de gradiente converja con paso $\\eta < 1/L$:\n$$\\|f(x_1) - f(x_2)\\| \\leq L\\,\\|x_1 - x_2\\| \\quad \\forall\\, x_1, x_2 \\in X$$"
      },
      {
        label: "Composición y el álgebra de funciones",
        body: "La composición $g \\circ f$ es la operación fundamental que encadena transformaciones. En el conjunto de todas las funciones $X \\to X$, la composición define un **monoide** (asociativa, con identidad $\\operatorname{id}_X$), y si restringimos a las biyecciones obtenemos el **grupo simétrico** $\\operatorname{Sym}(X)$.\n\nLas funciones $f: \\mathbb{R}^n \\to \\mathbb{R}^m$ diferenciables se componen mediante la **regla de la cadena**:\n$$D(g \\circ f)(x) = Dg(f(x)) \\cdot Df(x)$$\n\ndonde $Df(x) \\in \\mathbb{R}^{m \\times n}$ es la matriz Jacobiana. Esta regla, aplicada iterativamente a través de las capas de una red, es exactamente la **retropropagación** (*backpropagation*):\n$$\\frac{\\partial \\mathcal{L}}{\\partial \\theta_k} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{a}_L} \\cdot \\frac{\\partial \\mathbf{a}_L}{\\partial \\mathbf{a}_{L-1}} \\cdots \\frac{\\partial \\mathbf{a}_{k+1}}{\\partial \\theta_k}$$"
      },
      {
        label: "Funciones de orden superior y espacios funcionales",
        body: "Una **función de orden superior** toma funciones como argumentos o devuelve funciones. Ejemplos fundamentales:\n\n- **Funcional**: $J: C^1([a,b]) \\to \\mathbb{R}$, como $J[f] = \\int_a^b f(x)^2\\,dx$. El cálculo de variaciones optimiza sobre espacios funcionales.\n- **Operador diferencial**: $\\mathcal{D}: C^1 \\to C^0$, $\\mathcal{D}[f] = f'$.\n- **Transformada integral**: $\\mathcal{K}[f](y) = \\int K(x,y)f(x)\\,dx$ (núcleo de convolución en CNNs).\n\nEl espacio $L^2([a,b]) = \\{f: \\int_a^b |f|^2 < \\infty\\}$ con producto interno $\\langle f, g\\rangle = \\int_a^b f(x)g(x)\\,dx$ es un **espacio de Hilbert** de dimensión infinita. Los **kernels** en SVM y Gaussian Processes son funciones $k: X \\times X \\to \\mathbb{R}$ simétricas y semidefinidas positivas que definen implícitamente el producto interno en un espacio de Hilbert de dimensión (posiblemente infinita)."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "El aprendizaje automático es, fundamentalmente, **búsqueda en espacios de funciones**:\n\n**Hipótesis como función.** Un modelo de ML aproxima una función desconocida $f^*: \\mathcal{X} \\to \\mathcal{Y}$ dentro de una clase de hipótesis $\\mathcal{H} = \\{f_\\theta : \\theta \\in \\Theta\\}$. El entrenamiento es:\n$$\\hat{\\theta} = \\arg\\min_{\\theta \\in \\Theta}\\; \\frac{1}{n}\\sum_{i=1}^n \\ell(f_\\theta(\\mathbf{x}^{(i)}),\\, y^{(i)}) + \\lambda\\,\\Omega(\\theta)$$\n\n**Red neuronal = composición de funciones.** Una red de $L$ capas es:\n$$f_\\theta = f_L \\circ f_{L-1} \\circ \\cdots \\circ f_1, \\quad f_k(\\mathbf{x}) = \\sigma(W_k\\mathbf{x} + \\mathbf{b}_k)$$\n\n**Teorema de aproximación universal** (Hornik 1991): para cualquier $\\varepsilon > 0$ y $f^* \\in C(K)$ con $K \\subset \\mathbb{R}^n$ compacto, existe una red de una capa oculta con activación sigmoide y ancho suficiente tal que $\\sup_{x \\in K}|f_\\theta(x) - f^*(x)| < \\varepsilon$. Esto justifica teóricamente la expresividad de las redes neuronales.\n\n**Funciones de activación como no-linealidades.** Sin activaciones no lineales, cualquier composición de funciones afines sigue siendo afín: $W_2(W_1 x + b_1) + b_2 = (W_2 W_1)x + (W_2 b_1 + b_2)$. La no-linealidad es la condición necesaria para que la composición enriquezca la clase de hipótesis."
      },
    ],
    code: `import numpy as np
from typing import Callable, TypeVar
from functools import reduce

X = TypeVar("X")
Y = TypeVar("Y")
Z = TypeVar("Z")

# ── 1. Función como objeto de primera clase ───────────────────────────────────
f: Callable[[float], float] = lambda x: x**2 + 1
g: Callable[[float], float] = lambda x: np.sqrt(np.abs(x))

print("=== Función como objeto de primera clase ===")
print(f"f(3)    = {f(3)}")
print(f"g(4)    = {g(4):.4f}")

# ── 2. Composición de funciones ───────────────────────────────────────────────
def compose(*fns: Callable) -> Callable:
    """Compone funciones de derecha a izquierda: compose(h,g,f)(x) = h(g(f(x)))"""
    return reduce(lambda f, g: lambda x: f(g(x)), fns)

h = lambda x: np.log(x + 1e-9)
gof = compose(g, f)         # g ∘ f
hogof = compose(h, g, f)    # h ∘ g ∘ f

x = 2.0
print(f"\\n=== Composición ===")
print(f"f(x)      = {f(x):.4f}")
print(f"(g∘f)(x)  = {gof(x):.4f}   [esperado: sqrt(f(x))={np.sqrt(f(x)):.4f}]")
print(f"(h∘g∘f)(x)= {hogof(x):.4f}  [esperado: log(g(f(x)))={np.log(gof(x)):.4f}]")

# ── 3. Propiedades: inyectividad y sobreyectividad (numéricas) ────────────────
def es_inyectiva_numerica(f: Callable, dominio: np.ndarray, tol: float = 1e-8) -> bool:
    """Verifica inyectividad en una muestra discreta del dominio."""
    valores = [f(x) for x in dominio]
    for i in range(len(valores)):
        for j in range(i + 1, len(valores)):
            if np.abs(valores[i] - valores[j]) < tol and np.abs(dominio[i] - dominio[j]) > tol:
                return False
    return True

dominio = np.linspace(-3, 3, 200)
print(f"\\n=== Propiedades ===")
print(f"e^x  inyectiva en [-3,3]: {es_inyectiva_numerica(np.exp, dominio)}")
print(f"x²   inyectiva en [-3,3]: {es_inyectiva_numerica(lambda x: x**2, dominio)}")
print(f"x²   inyectiva en [0,3] : {es_inyectiva_numerica(lambda x: x**2, np.linspace(0,3,100))}")

# ── 4. Constante de Lipschitz empírica ───────────────────────────────────────
def lipschitz_empirico(f: Callable, dominio: np.ndarray, n_pares: int = 5000) -> float:
    """Estima L = sup |f(x₁)-f(x₂)| / |x₁-x₂| sobre pares aleatorios."""
    idx = np.random.randint(0, len(dominio), size=(n_pares, 2))
    x1, x2 = dominio[idx[:, 0]], dominio[idx[:, 1]]
    mask = np.abs(x1 - x2) > 1e-10
    ratios = np.abs(f(x1[mask]) - f(x2[mask])) / np.abs(x1[mask] - x2[mask])
    return float(ratios.max())

print(f"\\n=== Constante de Lipschitz (empírica) ===")
for nombre, fn, dom in [
    ("sin(x)",  np.sin,       np.linspace(-np.pi, np.pi, 500)),
    ("tanh(x)", np.tanh,      np.linspace(-5, 5, 500)),
    ("ReLU(x)", lambda x: np.maximum(0, x), np.linspace(-3, 3, 500)),
    ("x²",      lambda x: x**2,             np.linspace(-2, 2, 500)),
]:
    L = lipschitz_empirico(fn, dom)
    print(f"  L({nombre:10s}) ≈ {L:.4f}")

# ── 5. Red neuronal como composición de funciones ─────────────────────────────
class CapaDensa:
    """f_k(x) = σ(Wx + b)"""
    def __init__(self, d_in: int, d_out: int, activacion: Callable, seed: int = 0):
        rng = np.random.default_rng(seed)
        self.W = rng.standard_normal((d_out, d_in)) * np.sqrt(2 / d_in)  # He init
        self.b = np.zeros(d_out)
        self.sigma = activacion

    def __call__(self, x: np.ndarray) -> np.ndarray:
        return self.sigma(self.W @ x + self.b)

relu   = lambda x: np.maximum(0, x)
linear = lambda x: x

capas = [
    CapaDensa(4, 16, relu,   seed=1),
    CapaDensa(16, 8, relu,   seed=2),
    CapaDensa(8,  2, linear, seed=3),
]

# Red = composición secuencial
def red(x: np.ndarray, capas: list) -> np.ndarray:
    return reduce(lambda v, capa: capa(v), capas, x)

x_entrada = np.array([1.0, -0.5, 0.3, 2.1])
y_salida  = red(x_entrada, capas)
print(f"\\n=== Red neuronal como composición (4→16→8→2) ===")
print(f"Entrada : {x_entrada}")
print(f"Salida  : {y_salida.round(4)}")

# Verificar con paso manual
y_manual = capas[2](capas[1](capas[0](x_entrada)))
print(f"Manual  : {y_manual.round(4)}")
print(f"Coincide: {np.allclose(y_salida, y_manual)}")

# ── 6. Funcional de pérdida (función de funciones) ────────────────────────────
def mse(f_theta: Callable, X: np.ndarray, y: np.ndarray) -> float:
    """J[f_θ] = (1/n) Σ (f_θ(xᵢ) - yᵢ)² — funcional que evalúa la función f_θ"""
    preds = np.array([f_theta(xi) for xi in X])
    return float(np.mean((preds - y)**2))

np.random.seed(42)
X_data = np.linspace(-2, 2, 30)
y_data = 3 * X_data + 1 + np.random.randn(30) * 0.3   # recta + ruido

f_buena = lambda x: 3 * x + 1          # función cercana a la verdad
f_mala  = lambda x: 0 * x + 0          # función constante

print(f"\\n=== Funcional de pérdida MSE ===")
print(f"MSE(f_buena) = {mse(f_buena, X_data, y_data):.4f}")
print(f"MSE(f_mala)  = {mse(f_mala,  X_data, y_data):.4f}")
`,
    related: ["Variable", "Derivada y Gradiente", "Composición y Backpropagation", "Espacio Vectorial", "Función de Activación"],
    hasViz: true,
    vizType: "funcion",
  },
  {
    id: 6,
    section: "I. Fundamentos Numéricos y Funcionales",
    sectionCode: "I",
    name: "Dominio y Rango",
    tags: ["análisis", "función", "dominio", "imagen", "codominio", "restricción"],
    definition: "El dominio de una función f: X → Y es el conjunto X de todos los valores de entrada para los que f está definida. El rango (o imagen) es el subconjunto Im(f) = f(X) ⊆ Y de valores efectivamente alcanzados por f. El codominio Y es el conjunto de llegada declarado, que puede contener elementos no alcanzados. La distinción dominio / codominio / imagen es fundamental: determina sobreyectividad, inversibilidad y el comportamiento numérico de modelos en regiones fuera de la distribución de entrenamiento.",
    formal: {
      notation: "Sea $f: X \\to Y$; se define $\\operatorname{Dom}(f) = X$, $\\operatorname{Cod}(f) = Y$, $\\operatorname{Im}(f) = f(X)$",
      body: "\\operatorname{Dom}(f) := X = \\{x : f(x) \\text{ está definida}\\} \\\\ \\operatorname{Cod}(f) := Y \\quad (\\text{conjunto de llegada declarado}) \\\\ \\operatorname{Im}(f) := f(X) = \\{y \\in Y : \\exists\\, x \\in X,\\; f(x) = y\\} \\subseteq Y \\\\ \\textbf{Preimagen de un conjunto: } f^{-1}(B) = \\{x \\in X : f(x) \\in B\\},\\quad B \\subseteq Y \\\\ \\textbf{Restricción: } f|_A : A \\to Y,\\; (f|_A)(x) = f(x),\\quad A \\subseteq X \\\\ \\textbf{Dominio natural: } \\operatorname{Dom}_{\\text{nat}}(f) = \\{x \\in \\mathbb{R}^n : f(x) \\in \\mathbb{R}\\}",
      geometric: "f \\text{ sobreyectiva} \\iff \\operatorname{Im}(f) = Y \\\\ f \\text{ inversible} \\iff f \\text{ biyectiva} \\iff \\operatorname{Im}(f) = Y \\text{ y } f \\text{ inyectiva} \\\\ \\text{Gráfica: } \\Gamma_f = \\{(x, f(x)) : x \\in X\\} \\subseteq X \\times Y",
      properties: [
        "\\operatorname{Im}(g \\circ f) \\subseteq \\operatorname{Im}(g);\\quad \\text{igualdad si } \\operatorname{Im}(f) = \\operatorname{Dom}(g)",
        "f^{-1}(B_1 \\cup B_2) = f^{-1}(B_1) \\cup f^{-1}(B_2);\\quad f^{-1}(B_1 \\cap B_2) = f^{-1}(B_1) \\cap f^{-1}(B_2)",
        "A \\subseteq f^{-1}(f(A));\\quad f(f^{-1}(B)) \\subseteq B \\quad (\\text{igualdad si } f \\text{ sobreyectiva/inyectiva respectivamente})",
      ],
    },
    intuition: "El dominio es la 'zona de validez' de una función: todo lo que le puedes dar de comer. El rango es lo que realmente produce: no necesariamente llena todo el codominio. La diferencia importa muchísimo en ML: un modelo entrenado solo ve una región del dominio (la distribución de entrenamiento), y su rango efectivo puede ser mucho más pequeño que el codominio declarado. Cuando llega un dato fuera del dominio de entrenamiento (*out-of-distribution*), la función puede producir salidas arbitrarias — aunque técnicamente $f(x)$ exista, no tiene significado estadístico garantizado.",
    development: [
      {
        label: "Dominio natural y restricciones analíticas",
        body: "El **dominio natural** de una expresión analítica es el mayor subconjunto de $\\mathbb{R}^n$ en el que la expresión produce un valor real bien definido. Los obstáculos más comunes son:\n\n| Expresión | Restricción | Dominio natural |\n|---|---|---|\n| $\\sqrt{x}$ | $x \\geq 0$ | $[0, +\\infty)$ |\n| $\\log x$ | $x > 0$ | $(0, +\\infty)$ |\n| $1/x$ | $x \\neq 0$ | $\\mathbb{R}\\setminus\\{0\\}$ |\n| $\\arcsin x$ | $|x| \\leq 1$ | $[-1, 1]$ |\n| $\\sqrt{1-x^2-y^2}$ | $x^2+y^2 \\leq 1$ | Disco unitario en $\\mathbb{R}^2$ |\n\nEn funciones de varias variables, el dominio es un subconjunto de $\\mathbb{R}^n$ que puede ser abierto, cerrado o ninguno de los dos. La frontera del dominio suele ser el lugar donde ocurren discontinuidades, singularidades numéricas o comportamientos degenerados relevantes para la optimización."
      },
      {
        label: "Imagen, restricción y extensión de funciones",
        body: "Calcular la imagen exacta de una función puede ser difícil; a menudo se trabaja con cotas:\n$$\\operatorname{Im}(f) \\subseteq [\\inf_{x\\in X} f(x),\\; \\sup_{x\\in X} f(x)]$$\n\nCuando $f$ es continua en un compacto $K \\subset \\mathbb{R}^n$, el **Teorema del Valor Extremo** garantiza que el ínfimo y el supremo se alcanzan, y la imagen es un intervalo compacto (Teorema del Valor Intermedio en $\\mathbb{R}$).\n\nLa **restricción** $f|_A$ reduce el dominio a $A \\subseteq X$ preservando la regla. Esto permite:\n- Recuperar inyectividad: $\\sin|_{[-\\pi/2,\\,\\pi/2]}$ es inyectiva → define $\\arcsin$.\n- Definir inversas locales via el **Teorema de la Función Inversa**: si $Df(x_0)$ es invertible, $f$ es localmente biyectiva en un entorno de $x_0$.\n\nLa **extensión** $\\tilde{f}: \\tilde{X} \\supset X \\to Y$ amplía el dominio preservando $\\tilde{f}|_X = f$. En análisis funcional, el **Teorema de Hahn-Banach** garantiza extensiones de funcionales lineales."
      },
      {
        label: "Dominio en funciones multivariadas y transformaciones",
        body: "Para funciones $f: \\mathbb{R}^n \\to \\mathbb{R}^m$, el dominio puede tener geometría compleja. Casos relevantes en ML:\n\n**Función softmax** $\\sigma: \\mathbb{R}^K \\to \\Delta^{K-1}$:\n$$\\sigma(\\mathbf{z})_k = \\frac{e^{z_k}}{\\sum_{j=1}^K e^{z_j}}$$\n$\\operatorname{Dom} = \\mathbb{R}^K$, $\\operatorname{Im} = \\Delta^{K-1} = \\{\\mathbf{p} \\in \\mathbb{R}^K_{\\geq 0}: \\sum p_k = 1\\}$ (símplex abierto). El rango **nunca** incluye las esquinas del símplex (probabilidades 0 o 1 exactas) con entradas finitas.\n\n**Función log-verosimilitud** $\\ell: (0,1) \\to (-\\infty, 0)$, $\\ell(p) = \\log p$. El dominio excluye $p=0$; la imagen es la semirrecta negativa. Intentar evaluar $\\log(0)$ — ocurre con predicciones de probabilidad exactamente 0 — es el origen del *log(0) = -inf* que desestabiliza el entrenamiento.\n\n**Transformaciones afines** $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$: $\\operatorname{Im}(T) = \\operatorname{col}(A) + \\mathbf{b}$ (subespacio afín de dimensión $\\operatorname{rank}(A)$). Si $\\operatorname{rank}(A) < m$, la imagen es un subespacio propio de $\\mathbb{R}^m$ — la función **no** es sobreyectiva."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "El dominio y el rango tienen implicaciones directas en el diseño y la robustez de modelos:\n\n**Dominio de entrenamiento vs. dominio de despliegue.** El modelo aprende $f_\\theta$ sobre muestras de $P_{\\text{train}}$, cuyo soporte es el dominio efectivo de entrenamiento. En inferencia, si $\\mathbf{x} \\notin \\operatorname{supp}(P_{\\text{train}})$ (dato *OOD*), la predicción es una extrapolación sin garantía estadística. Técnicas de detección OOD (energy score, Mahalanobis distance) estiman si $\\mathbf{x}$ está en la región de cobertura.\n\n**Rango de activaciones y normalización.** Cada capa mapea $\\mathbf{h}_k \\in \\mathbb{R}^{d_k}$ (dominio $\\mathbb{R}^{d_k}$, rango $\\mathbb{R}^{d_k}$ si es afín, o $\\mathbb{R}^{d_k}_{\\geq 0}$ si es ReLU). Batch Normalization restringe el rango efectivo de las activaciones a media $\\approx 0$ y varianza $\\approx 1$ antes de la capa siguiente — cambia el dominio efectivo de la próxima función.\n\n**Rango de funciones de pérdida.** El diseño de $\\mathcal{L}$ impone restricciones:\n- Cross-entropy: $\\mathcal{L} \\in [0, +\\infty)$; no acotada superiormente → gradientes pueden explotar.\n- MSE: $\\mathcal{L} \\in [0, +\\infty)$; sensible a outliers por cuadratura.\n- Huber loss: $\\mathcal{L} \\in [0, +\\infty)$; acotada en derivadas → robusto a outliers.\n\n**Clipping y saturación.** Operaciones como `torch.clamp(x, -1, 1)` restringen explícitamente el rango. Las activaciones sigmoid/tanh saturan el rango a $(0,1)$ o $(-1,1)$: la imagen nunca alcanza los extremos, lo que provoca el problema de **gradientes que se desvanecen** en regiones de saturación donde $f'(x) \\approx 0$."
      },
    ],
    code: `import numpy as np
from typing import Callable, Optional

# ── 1. Dominio natural: detección de puntos inválidos ─────────────────────────
def evaluar_seguro(
    f: Callable[[float], float],
    xs: np.ndarray,
    centinela: float = np.nan,
) -> tuple[np.ndarray, np.ndarray]:
    """
    Evalúa f en xs, marcando con centinela los puntos fuera del dominio natural.
    Devuelve (valores, máscara_dominio).
    """
    valores = np.full_like(xs, centinela, dtype=float)
    mascara = np.zeros(len(xs), dtype=bool)
    for i, x in enumerate(xs):
        try:
            with np.errstate(all="raise"):
                v = f(x)
            if np.isfinite(v):
                valores[i] = v
                mascara[i] = True
        except (FloatingPointError, ValueError, ZeroDivisionError):
            pass
    return valores, mascara

xs = np.linspace(-2, 4, 9)
print("=== Dominio natural ===")
for nombre, fn in [
    ("sqrt(x)",   np.sqrt),
    ("log(x)",    np.log),
    ("1/x",       lambda x: 1 / x),
    ("arcsin(x)", np.arcsin),
]:
    vals, mask = evaluar_seguro(fn, xs)
    dom = xs[mask]
    print(f"  {nombre:12s}: Dom ⊆ [{dom.min():.2f}, {dom.max():.2f}] | "
          f"Im ⊆ [{vals[mask].min():.3f}, {vals[mask].max():.3f}]  "
          f"({mask.sum()}/{len(xs)} puntos válidos)")

# ── 2. Cálculo de imagen empírica ─────────────────────────────────────────────
def imagen_empirica(
    f: Callable[[np.ndarray], np.ndarray],
    dominio: np.ndarray,
    n_puntos: int = 10_000,
) -> tuple[float, float]:
    """Aproxima [inf Im(f), sup Im(f)] muestreando densamente el dominio."""
    if dominio.ndim == 1:
        xs = np.linspace(dominio[0], dominio[1], n_puntos)
    else:
        xs = dominio
    ys = f(xs)
    ys = ys[np.isfinite(ys)]
    return float(ys.min()), float(ys.max())

print("\\n=== Imagen (rango) empírico ===")
casos = [
    ("sin(x)    en [-π, π]",  np.sin,         np.array([-np.pi, np.pi])),
    ("tanh(x)   en [-5, 5]",  np.tanh,        np.array([-5., 5.])),
    ("x²        en [-3, 3]",  lambda x: x**2, np.array([-3., 3.])),
    ("sigmoid   en [-10,10]", lambda x: 1/(1+np.exp(-x)), np.array([-10., 10.])),
    ("ReLU      en [-3, 3]",  lambda x: np.maximum(0, x), np.array([-3., 3.])),
]
for nombre, fn, dom in casos:
    lo, hi = imagen_empirica(fn, dom)
    print(f"  Im({nombre}) ≈ [{lo:.5f}, {hi:.5f}]")

# ── 3. Restricción de dominio para recuperar inyectividad → inversa ───────────
print("\\n=== Restricción de dominio: sin → arcsin ===")
# sin es inyectiva en [-π/2, π/2]
dominio_restringido = np.linspace(-np.pi/2, np.pi/2, 7)
for x in dominio_restringido:
    y = np.sin(x)
    x_rec = np.arcsin(y)          # inversa en el dominio restringido
    print(f"  x={x:+.3f} → sin={y:+.5f} → arcsin={x_rec:+.3f}  "
          f"| error={abs(x-x_rec):.2e}")

# ── 4. Softmax: dominio ℝ^K → imagen ⊂ Δ^{K-1} ──────────────────────────────
def softmax(z: np.ndarray) -> np.ndarray:
    """Numéricamente estable: Im ⊂ Δ^{K-1} (símplex abierto)."""
    e = np.exp(z - z.max())
    return e / e.sum()

print("\\n=== Softmax: dominio ℝ^K → Im ⊂ Δ^{K-1} ===")
for z in [np.array([1., 2., 3.]),
          np.array([100., 0., 0.]),    # caso extremo
          np.array([0., 0., 0.])]:     # uniforme
    p = softmax(z)
    print(f"  z={z} → p={p.round(6)}  "
          f"| Σ={p.sum():.8f}  | p∈(0,1)={all(0<pi<1 for pi in p)}")

# ── 5. Detección OOD: distancia de Mahalanobis al dominio de entrenamiento ────
print("\\n=== Detección OOD con distancia de Mahalanobis ===")
np.random.seed(42)

# Simula activaciones de la última capa en entrenamiento (distribución entrenamiento)
n_train = 500
mu_train = np.array([1.0, 2.0, 0.5])
cov_train = np.array([[1.0, 0.5, 0.2],
                       [0.5, 1.5, 0.1],
                       [0.2, 0.1, 0.8]])
X_train = np.random.multivariate_normal(mu_train, cov_train, n_train)

# Estima parámetros de la clase
mu_hat   = X_train.mean(axis=0)
cov_hat  = np.cov(X_train.T)
cov_inv  = np.linalg.inv(cov_hat)

def mahalanobis(x: np.ndarray, mu: np.ndarray, sigma_inv: np.ndarray) -> float:
    d = x - mu
    return float(np.sqrt(d @ sigma_inv @ d))

# Puntos de prueba: in-distribution y OOD
puntos = {
    "In-dist  A": np.array([1.1, 2.2, 0.6]),
    "In-dist  B": np.array([0.8, 1.7, 0.4]),
    "OOD      C": np.array([5.0, 8.0, 4.0]),
    "OOD      D": np.array([-3., -2., -3.]),
}
for nombre, x_test in puntos.items():
    dist = mahalanobis(x_test, mu_hat, cov_inv)
    etiqueta = "✓ In-domain" if dist < 3.5 else "⚠ OOD"
    print(f"  {nombre}: Mahal={dist:.3f}  → {etiqueta}")

# ── 6. Saturación de sigmoid y efecto en el gradiente ─────────────────────────
print("\\n=== Saturación: rango de sigmoid y sus derivadas ===")
xs_sat = np.array([-10., -5., -2., 0., 2., 5., 10.])
sig    = lambda x: 1 / (1 + np.exp(-x))
dsig   = lambda x: sig(x) * (1 - sig(x))   # σ'(x)

print(f"  {'x':>6s} | {'σ(x)':>10s} | {'σ'(x)':>10s} | Zona")
for x in xs_sat:
    s, ds = sig(x), dsig(x)
    zona = "SATURADA" if abs(x) > 4 else "activa"
    print(f"  {x:6.1f} | {s:10.6f} | {ds:10.6f} | {zona}")
`,
    related: ["Función", "Variable", "Función de Activación", "Distribución de Probabilidad", "Detección OOD"],
    hasViz: true,
    vizType: "dominioRango",
  },
  {
    id: 7,
    section: "I. Fundamentos Numéricos y Funcionales",
    sectionCode: "I",
    name: "Composición de Funciones",
    tags: ["análisis", "función", "cadena", "backpropagation", "grafo computacional", "regla de la cadena"],
    definition: "La composición de funciones es la operación que construye una nueva función aplicando sucesivamente dos o más funciones: la salida de una se convierte en la entrada de la siguiente. Dadas f: X → Y y g: Y → Z, la composición g ∘ f: X → Z se define como (g ∘ f)(x) = g(f(x)). La composición es asociativa pero en general no conmutativa, y constituye el mecanismo central de toda red neuronal profunda: cada capa es una función, y la red completa es su composición.",
    formal: {
      notation: "Sean $f: X \\to Y$ y $g: Y \\to Z$; la composición se denota $g \\circ f: X \\to Z$",
      body: "(g \\circ f)(x) := g(f(x)), \\quad \\forall\\, x \\in X \\\\ \\textbf{Condición de compatibilidad: } \\operatorname{Im}(f) \\subseteq \\operatorname{Dom}(g) \\\\ \\textbf{Composición de }n\\text{ funciones: } (f_n \\circ \\cdots \\circ f_1)(x) = f_n(f_{n-1}(\\cdots f_1(x)\\cdots)) \\\\ \\textbf{Regla de la cadena (diferenciable): } (g \\circ f)'(x) = g'(f(x)) \\cdot f'(x) \\\\ \\textbf{Jacobiana de la composición: } D(g \\circ f)(x) = Dg(f(x))\\, Df(x) \\in \\mathbb{R}^{p \\times n}",
      geometric: "\\text{Red de }L\\text{ capas: } f_\\theta = f_L \\circ f_{L-1} \\circ \\cdots \\circ f_1 \\\\ \\frac{\\partial \\mathcal{L}}{\\partial \\theta_k} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{a}_L} \\cdot \\prod_{\\ell=k+1}^{L} \\frac{\\partial \\mathbf{a}_\\ell}{\\partial \\mathbf{a}_{\\ell-1}} \\cdot \\frac{\\partial \\mathbf{a}_k}{\\partial \\theta_k} \\quad (\\text{backprop})",
      properties: [
        "\\text{Asociatividad: } (h \\circ g) \\circ f = h \\circ (g \\circ f) \\quad \\forall\\, f,g,h \\text{ compatibles}",
        "\\text{No conmutativa en general: } g \\circ f \\neq f \\circ g \\quad (\\text{cuando ambas estén definidas})",
        "\\text{Identidad: } f \\circ \\operatorname{id}_X = \\operatorname{id}_Y \\circ f = f \\quad \\text{(monoide bajo } \\circ\\text{)}",
      ],
    },
    intuition: "Imagina una cadena de montaje: cada estación recibe una pieza, le hace una transformación específica, y pasa el resultado a la siguiente. La composición $g \\circ f$ es exactamente eso — primero pasa por la máquina $f$, luego por la máquina $g$. Lo crucial es que el orden importa: pintar antes de pulir no es lo mismo que pulir antes de pintar. En deep learning, cada capa es una estación de transformación, y el modelo completo es la cadena entera. La retropropagación es simplemente la regla de la cadena aplicada de atrás hacia adelante a lo largo de esa cadena.",
    development: [
      {
        label: "Álgebra de la composición: monoide y grupos",
        body: "El conjunto de todas las funciones $X \\to X$ con la operación $\\circ$ forma un **monoide**: es asociativa y tiene elemento neutro $\\operatorname{id}_X$. Si restringimos a las biyecciones $X \\to X$, obtenemos el **grupo simétrico** $\\operatorname{Sym}(X)$ donde además todo elemento tiene inverso ($f^{-1}$ tal que $f^{-1} \\circ f = \\operatorname{id}_X$).\n\nLa no-conmutatividad tiene consecuencias profundas. Para $f(x) = x^2$ y $g(x) = x+1$:\n$$(g \\circ f)(x) = x^2 + 1 \\neq x^2 + 2x + 1 = (f \\circ g)(x)$$\n\nEn redes neuronales, reordenar capas produce modelos completamente distintos. La arquitectura (el orden de composición) es parte central del diseño del modelo."
      },
      {
        label: "Regla de la cadena multivariada y Jacobiana",
        body: "Para funciones diferenciables $f: \\mathbb{R}^n \\to \\mathbb{R}^m$ y $g: \\mathbb{R}^m \\to \\mathbb{R}^p$, la **regla de la cadena** establece que la derivada de la composición es el producto de las Jacobianas evaluadas en el punto apropiado:\n$$D(g \\circ f)(x) = Dg(\\underbrace{f(x)}_{\\text{punto de eval.}}) \\cdot Df(x) \\in \\mathbb{R}^{p \\times n}$$\n\nPara una composición de $L$ funciones $h = f_L \\circ \\cdots \\circ f_1$:\n$$Dh(x) = Df_L(\\mathbf{a}_{L-1}) \\cdot Df_{L-1}(\\mathbf{a}_{L-2}) \\cdots Df_1(x)$$\n\ndonde $\\mathbf{a}_k = f_k(\\mathbf{a}_{k-1})$ son las activaciones intermedias. Este producto de matrices es el corazón de la **retropropagación**: se computa de derecha a izquierda (hacia atrás) para reutilizar cálculos intermedios eficientemente mediante programación dinámica."
      },
      {
        label: "Grafo computacional y diferenciación automática",
        body: "La composición de funciones define un **grafo computacional dirigido acíclico (DAG)**: los nodos son operaciones (funciones elementales), las aristas transportan los valores intermedios (tensores). La diferenciación automática (*autograd*) explota este grafo de dos formas:\n\n**Modo hacia adelante** (*forward mode*): propaga las derivadas de izquierda a derecha junto con los valores. Eficiente cuando $n \\ll p$ (pocas entradas, muchas salidas).\n\n**Modo hacia atrás** (*reverse mode / backpropagation*): propaga los gradientes de derecha a izquierda. Eficiente cuando $p \\ll n$, que es exactamente el caso de ML ($p=1$, la pérdida es escalar):\n$$\\bar{x}_k = \\frac{\\partial \\mathcal{L}}{\\partial x_k} = \\sum_{j} \\frac{\\partial \\mathcal{L}}{\\partial z_j} \\frac{\\partial z_j}{\\partial x_k}$$\n\nEl coste de reverse mode es $\\mathcal{O}(\\text{coste forward})$ independientemente del número de parámetros $p$ — razón por la que es la elección universal en DL."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "La composición de funciones es la operación definitoria de deep learning:\n\n**Profundidad = composición.** Una red de $L$ capas es $f_\\theta = f_L \\circ \\cdots \\circ f_1$ donde $f_k(\\mathbf{x}) = \\sigma_k(W_k\\mathbf{x} + \\mathbf{b}_k)$. La profundidad permite representar funciones de complejidad creciente con menos parámetros totales que una red de una sola capa de igual capacidad.\n\n**Gradiente de la pérdida como producto de Jacobianas.** Sea $\\mathcal{L} = \\ell \\circ f_L \\circ \\cdots \\circ f_1$:\n$$\\frac{\\partial \\mathcal{L}}{\\partial W_k} = \\underbrace{\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{a}_L}}_{\\delta_L} \\cdot J_L \\cdots J_{k+1} \\cdot \\frac{\\partial \\mathbf{a}_k}{\\partial W_k}$$\n\n**Desvanecimiento y explosión de gradientes.** Si las normas de las Jacobianas $\\|J_\\ell\\| < 1$ uniformemente, el producto decrece exponencialmente hacia capas tempranas → **vanishing gradient**. Si $\\|J_\\ell\\| > 1$ → **exploding gradient**. Soluciones: ResNets (skip connections crean caminos cortos), normalización de capas (controla $\\|J_\\ell\\|$), inicialización cuidadosa.\n\n**ResNet como suma de composiciones.** La conexión residual redefine la unidad de composición:\n$$\\mathbf{a}_{k+1} = \\mathbf{a}_k + \\mathcal{F}(\\mathbf{a}_k; \\theta_k) \\quad \\Rightarrow \\quad \\frac{\\partial \\mathbf{a}_{k+1}}{\\partial \\mathbf{a}_k} = I + \\frac{\\partial \\mathcal{F}}{\\partial \\mathbf{a}_k}$$\n\nEl término identidad $I$ garantiza que el gradiente tiene siempre un camino directo hacia atrás, mitigando el desvanecimiento independientemente de la profundidad."
      },
    ],
    code: `import numpy as np
from typing import Callable, List, Tuple
from functools import reduce

# ── 1. Composición genérica de funciones ──────────────────────────────────────
def compose(*fns: Callable) -> Callable:
    """
    Devuelve la composición fₙ ∘ ⋯ ∘ f₁.
    compose(h, g, f)(x) == h(g(f(x)))
    """
    return reduce(lambda g, f: lambda x: g(f(x)), fns)

f = lambda x: x**2          # f: ℝ → ℝ
g = lambda x: x + 1         # g: ℝ → ℝ
h = lambda x: np.sqrt(np.abs(x))

gof   = compose(g, f)       # g ∘ f
hogof = compose(h, g, f)    # h ∘ g ∘ f

print("=== Composición de funciones escalares ===")
x0 = 3.0
print(f"f({x0})         = {f(x0)}")
print(f"(g∘f)({x0})     = {gof(x0)}   [g(f(x)) = f(x)+1 = {f(x0)+1}]")
print(f"(h∘g∘f)({x0})   = {hogof(x0):.4f}")

# No conmutatividad
fog = compose(f, g)
print(f"\\n(g∘f)(x) = x²+1  vs  (f∘g)(x) = (x+1)²")
print(f"  g∘f en x=3: {gof(3)}  |  f∘g en x=3: {fog(3)}  → distintos: {gof(3)!=fog(3)}")

# ── 2. Regla de la cadena univariada ──────────────────────────────────────────
def derivada_numerica(f: Callable, x: float, h: float = 1e-7) -> float:
    return (f(x + h) - f(x - h)) / (2 * h)

print("\\n=== Regla de la cadena: (g∘f)'(x) = g'(f(x))·f'(x) ===")
x0 = 2.0
# f(x) = sin(x),  g(y) = y²
f2 = np.sin
g2 = lambda y: y**2

dfdx   = derivada_numerica(f2, x0)                      # f'(x)
dgdy   = derivada_numerica(g2, f2(x0))                  # g'(f(x))
cadena = dgdy * dfdx                                     # regla de la cadena
directo= derivada_numerica(compose(g2, f2), x0)         # verificación directa

print(f"  f(x)=sin(x),  g(y)=y²  en x={x0}")
print(f"  f'(x)       = {dfdx:.6f}   [cos({x0})={np.cos(x0):.6f}]")
print(f"  g'(f(x))    = {dgdy:.6f}   [2·sin({x0})={2*np.sin(x0):.6f}]")
print(f"  Cadena      = {cadena:.6f}")
print(f"  Directo     = {directo:.6f}")
print(f"  Error       = {abs(cadena-directo):.2e}")

# ── 3. Jacobiana de una composición vectorial ─────────────────────────────────
def jacobiana(f: Callable, x: np.ndarray, eps: float = 1e-6) -> np.ndarray:
    """Jacobiana numérica Df(x) ∈ ℝ^{m×n} por diferencias finitas centradas."""
    fx = f(x)
    m, n = len(fx), len(x)
    J = np.zeros((m, n))
    for j in range(n):
        ej = np.zeros(n); ej[j] = eps
        J[:, j] = (f(x + ej) - f(x - ej)) / (2 * eps)
    return J

# f: ℝ² → ℝ³,  g: ℝ³ → ℝ²
def f_vec(x):
    return np.array([x[0]**2 + x[1], np.sin(x[0]*x[1]), np.exp(-x[0])])

def g_vec(y):
    return np.array([y[0]*y[1] + y[2], y[0] - y[2]**2])

x = np.array([1.0, 2.0])
Jf = jacobiana(f_vec, x)            # Df(x) ∈ ℝ^{3×2}
Jg = jacobiana(g_vec, f_vec(x))     # Dg(f(x)) ∈ ℝ^{2×3}
J_cadena = Jg @ Jf                  # D(g∘f)(x) ∈ ℝ^{2×2}  — regla de la cadena
J_directo= jacobiana(compose(g_vec, f_vec), x)

print("\\n=== Jacobiana de composición vectorial ===")
print(f"Df(x) ∈ ℝ^{{{Jf.shape[0]}×{Jf.shape[1]}}}:\\n{Jf.round(4)}")
print(f"Dg(f(x)) ∈ ℝ^{{{Jg.shape[0]}×{Jg.shape[1]}}}:\\n{Jg.round(4)}")
print(f"D(g∘f)(x) = Dg·Df ∈ ℝ^{{{J_cadena.shape[0]}×{J_cadena.shape[1]}}}:\\n{J_cadena.round(4)}")
print(f"Directo:\\n{J_directo.round(4)}")
print(f"Error máx: {np.abs(J_cadena - J_directo).max():.2e}")

# ── 4. Red neuronal como composición + backprop manual ────────────────────────
class Capa:
    """f_k(x) = σ(Wx + b) con retropropagación."""
    def __init__(self, d_in, d_out, sigma, dsigma, seed=0):
        rng = np.random.default_rng(seed)
        self.W = rng.standard_normal((d_out, d_in)) * np.sqrt(2/d_in)
        self.b = np.zeros(d_out)
        self.sigma  = sigma
        self.dsigma = dsigma   # derivada de σ

    def forward(self, x):
        self.x = x
        self.z = self.W @ x + self.b   # preactivación
        self.a = self.sigma(self.z)    # activación
        return self.a

    def backward(self, grad_a):
        # grad_a = ∂L/∂a  (viene de la capa siguiente)
        grad_z = self.dsigma(self.z) * grad_a      # ∂L/∂z = ∂L/∂a ⊙ σ'(z)
        self.grad_W = np.outer(grad_z, self.x)     # ∂L/∂W
        self.grad_b = grad_z                       # ∂L/∂b
        return self.W.T @ grad_z                   # ∂L/∂x (para la capa anterior)

relu    = lambda z: np.maximum(0, z)
drelu   = lambda z: (z > 0).astype(float)
linear  = lambda z: z
dlinear = lambda z: np.ones_like(z)

capas = [
    Capa(3, 8,  relu,   drelu,   seed=1),
    Capa(8, 4,  relu,   drelu,   seed=2),
    Capa(4, 1,  linear, dlinear, seed=3),
]

# Forward: composición secuencial
np.random.seed(0)
x_in   = np.array([1.0, -0.5, 0.8])
y_true = np.array([1.5])

a = x_in
for capa in capas:
    a = capa.forward(a)
y_pred = a

# Pérdida MSE: L = ½‖y_pred - y_true‖²
loss = 0.5 * np.sum((y_pred - y_true)**2)
grad = y_pred - y_true              # ∂L/∂y_pred

# Backward: regla de la cadena en reversa
for capa in reversed(capas):
    grad = capa.backward(grad)

print("\\n=== Red 3→8→4→1: forward + backprop manual ===")
print(f"y_pred = {y_pred.round(4)}, y_true = {y_true}, loss = {loss:.4f}")
print(f"Gradiente ∂L/∂x (entrada): {grad.round(6)}")
for i, capa in enumerate(capas):
    print(f"  Capa {i+1}: ‖∂L/∂W‖ = {np.linalg.norm(capa.grad_W):.4f}")

# ── 5. Verificación con gradiente numérico (gradient check) ───────────────────
print("\\n=== Gradient check (Jacobiana numérica vs backprop) ===")
eps = 1e-5
grad_num = np.zeros_like(x_in)
for j in range(len(x_in)):
    x_plus, x_minus = x_in.copy(), x_in.copy()
    x_plus[j]  += eps; x_minus[j] -= eps

    def forward_only(x):
        a = x
        for capa in capas:
            z = capa.W @ a + capa.b
            a = capa.sigma(z)
        return 0.5 * np.sum((a - y_true)**2)

    grad_num[j] = (forward_only(x_plus) - forward_only(x_minus)) / (2*eps)

print(f"Backprop  ∂L/∂x: {grad.round(6)}")
print(f"Numérico  ∂L/∂x: {grad_num.round(6)}")
print(f"Error rel máx   : {np.max(np.abs(grad-grad_num)/(np.abs(grad_num)+1e-8)):.2e}")
`,
    related: ["Función", "Dominio y Rango", "Derivada y Gradiente", "Backpropagation", "Grafo Computacional"],
    hasViz: true,
    vizType: "composicionFunciones",
  },
  {
    id: 8,
    section: "I. Fundamentos Numéricos y Funcionales",
    sectionCode: "I",
    name: "Función Inversa",
    tags: ["análisis", "biyección", "invertibilidad", "función inversa", "teorema de la función inversa"],
    definition: "Dada una función biyectiva f: X → Y, su función inversa f⁻¹: Y → X es la única función que satisface f⁻¹(f(x)) = x para todo x ∈ X y f(f⁻¹(y)) = y para todo y ∈ Y. La existencia de la inversa global requiere biyectividad; el Teorema de la Función Inversa garantiza la existencia de inversas locales para funciones diferenciables con Jacobiana invertible en un punto. En ML, la invertibilidad es central en flujos normalizantes, cambios de variable en densidades y transformaciones biyectivas de espacios latentes.",
    formal: {
      notation: "Sea $f: X \\to Y$ biyectiva; su inversa $f^{-1}: Y \\to X$ satisface $f^{-1} \\circ f = \\operatorname{id}_X$ y $f \\circ f^{-1} = \\operatorname{id}_Y$",
      body: "f^{-1}(y) = x \\iff f(x) = y, \\quad \\forall\\, x \\in X,\\; y \\in Y \\\\ \\textbf{Existencia global: } f \\text{ biyectiva} \\iff \\exists!\\, f^{-1}: Y \\to X \\\\ \\textbf{Teorema de la función inversa (local): } f \\in C^1(U),\\; Df(x_0) \\text{ invertible} \\\\ \\quad \\Rightarrow \\exists\\, V \\ni x_0 \\text{ abierto tal que } f|_V \\text{ es } C^1\\text{-difeomorfismo sobre } f(V) \\\\ \\quad \\text{con } D(f^{-1})(y_0) = [Df(x_0)]^{-1}, \\quad y_0 = f(x_0) \\\\ \\textbf{Fórmula de la derivada: } (f^{-1})'(y) = \\dfrac{1}{f'(f^{-1}(y))}",
      geometric: "\\text{Gráfica de } f^{-1} = \\text{reflexión de } \\Gamma_f \\text{ respecto a la diagonal } y = x \\\\ \\Gamma_{f^{-1}} = \\{(y, x) : (x, y) \\in \\Gamma_f\\} \\\\ \\textbf{Cambio de variable: } \\int_a^b g(f(x))f'(x)\\,dx = \\int_{f(a)}^{f(b)} g(y)\\,dy",
      properties: [
        "(f^{-1})^{-1} = f \\quad \\text{y} \\quad (g \\circ f)^{-1} = f^{-1} \\circ g^{-1} \\quad (\\text{inversión invierte el orden})",
        "\\text{Cambio de variable en densidades: } p_Y(y) = p_X(f^{-1}(y))\\,|\\det J_{f^{-1}}(y)| = \\dfrac{p_X(x)}{|\\det J_f(x)|}",
        "\\text{Si } f \\text{ es isometría lineal (unitaria): } f^{-1} = f^\\top \\quad (\\text{inversa = transpuesta})",
      ],
    },
    intuition: "Si una función es una 'máquina de transformación' que convierte $x$ en $y$, la función inversa es la misma máquina corriendo en sentido contrario: recibe $y$ y devuelve el $x$ original. Esto solo es posible si la máquina es perfectamente reversible — nunca 'aplasta' dos entradas distintas en la misma salida. En geometría, la gráfica de $f^{-1}$ es el reflejo de la gráfica de $f$ respecto a la diagonal $y=x$: lo que era altura se convierte en ancho y viceversa. En flujos normalizantes, encadenamos transformaciones invertibles para convertir una distribución compleja en una gaussiana simple, y la función inversa es el decodificador que recorre el camino de vuelta.",
    development: [
      {
        label: "Condiciones de invertibilidad y restricciones de dominio",
        body: "La invertibilidad global requiere **biyectividad**: inyectividad (cada salida proviene de a lo sumo una entrada) y sobreyectividad (toda salida está en la imagen). Cuando $f$ no es globalmente biyectiva, se puede recuperar la invertibilidad **restringiendo el dominio**:\n\n| Función | Dom. natural | Restricción inyectiva | Inversa |\n|---|---|---|---|\n| $\\sin x$ | $\\mathbb{R}$ | $[-\\pi/2, \\pi/2]$ | $\\arcsin$ |\n| $\\cos x$ | $\\mathbb{R}$ | $[0, \\pi]$ | $\\arccos$ |\n| $x^2$ | $\\mathbb{R}$ | $[0,\\infty)$ | $\\sqrt{x}$ |\n| $e^x$ | $\\mathbb{R}$ | $\\mathbb{R}$ (ya inyectiva) | $\\ln x$ |\n| $\\tan x$ | $\\mathbb{R}\\setminus\\{\\frac{\\pi}{2}+k\\pi\\}$ | $(-\\pi/2,\\pi/2)$ | $\\arctan$ |\n\nLa elección de la rama de la restricción es una **convención**: $\\sqrt{x}$ elige la rama positiva de $x^2$. En ML, las funciones de activación como ReLU no son inyectivas en $\\mathbb{R}$ (ReLU$(x)=0$ para todo $x\\leq 0$), lo que hace que ciertas capas sean no invertibles — limitación relevante para flujos normalizantes que exigen biyectividad estricta."
      },
      {
        label: "Teorema de la función inversa y derivada de la inversa",
        body: "El **Teorema de la Función Inversa** establece que la invertibilidad local es consecuencia de la invertibilidad de la Jacobiana:\n\n**Enunciado**: Sea $f: U \\subseteq \\mathbb{R}^n \\to \\mathbb{R}^n$ de clase $C^1$ y $x_0 \\in U$ tal que $Df(x_0)$ es invertible (i.e., $\\det Df(x_0) \\neq 0$). Entonces existen abiertos $V \\ni x_0$ y $W \\ni f(x_0)$ tales que $f|_V: V \\to W$ es un $C^1$-difeomorfismo y:\n$$D(f^{-1})(y_0) = [Df(x_0)]^{-1}, \\quad y_0 = f(x_0)$$\n\nEn dimensión 1: $(f^{-1})'(y) = 1/f'(f^{-1}(y))$, que tiene la interpretación geométrica de que la pendiente de $f^{-1}$ en $(y, x)$ es el recíproco de la pendiente de $f$ en $(x, y)$.\n\nEl **jacobiano del cambio de variable** para densidades de probabilidad es:\n$$p_Y(y) = p_X(f^{-1}(y))\\,|\\det J_{f^{-1}}(y)|$$\n\nEsta fórmula es la base de los **flujos normalizantes**: si $f$ es una biyección diferenciable con Jacobiana tratable, podemos calcular la densidad transformada exactamente."
      },
      {
        label: "Inversas en álgebra lineal: matrices y pseudoinversa",
        body: "Para transformaciones lineales $f(\\mathbf{x}) = A\\mathbf{x}$ con $A \\in \\mathbb{R}^{n\\times n}$:\n- $f$ es invertible $\\iff$ $A$ es invertible $\\iff$ $\\det(A) \\neq 0$ $\\iff$ $\\operatorname{rank}(A) = n$\n- La inversa es $f^{-1}(\\mathbf{y}) = A^{-1}\\mathbf{y}$\n\nCuando $A \\in \\mathbb{R}^{m \\times n}$ con $m \\neq n$ o $\\operatorname{rank}(A) < \\min(m,n)$, no existe inversa exacta. Se define la **pseudoinversa de Moore-Penrose** $A^+$ como la solución de mínima norma al sistema $\\min_\\mathbf{x} \\|\\mathbf{x}\\|$ sujeto a $\\min \\|A\\mathbf{x} - \\mathbf{b}\\|$:\n$$A^+ = V\\Sigma^+U^\\top \\quad \\text{(vía SVD: } A = U\\Sigma V^\\top\\text{)}$$\ndonde $\\Sigma^+$ invierte los valores singulares no nulos. La pseudoinversa generaliza la inversa y aparece en la solución de mínimos cuadrados: $\\hat{\\mathbf{x}} = A^+\\mathbf{b}$."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "La inversabilidad es un concepto estructural en varios pilares del ML moderno:\n\n**Flujos normalizantes** (*Normalizing Flows*). Aprenden una biyección $f_\\theta: \\mathcal{Z} \\to \\mathcal{X}$ entre una distribución base simple $p_Z$ (p.ej. gaussiana) y la distribución de datos $p_X$. El entrenamiento maximiza la log-verosimilitud exacta:\n$$\\log p_X(\\mathbf{x}) = \\log p_Z(f_\\theta^{-1}(\\mathbf{x})) + \\log|\\det J_{f_\\theta^{-1}}(\\mathbf{x})|$$\nArquitecturas como RealNVP, GLOW y Neural Spline Flows diseñan $f_\\theta$ con Jacobianas triangulares cuyo determinante se computa en $\\mathcal{O}(d)$.\n\n**Inversas en atención**. La operación de atención $\\operatorname{Attn}(Q,K,V) = \\operatorname{softmax}(QK^\\top/\\sqrt{d_k})V$ no es en general invertible respecto a $V$ (softmax colapsa información). Sin embargo, arquitecturas como *Reversible Transformers* (RevNet, Reformer) diseñan bloques invertibles para reducir memoria durante entrenamiento: al propagar hacia atrás se reconstruyen las activaciones usando $f^{-1}$ en lugar de guardarlas.\n\n**Inicialización ortogonal**. Las matrices ortogonales $Q \\in \\mathbb{R}^{n\\times n}$ (con $Q^{-1}=Q^\\top$) son las isometrías lineales: preservan normas y ángulos. La inicialización ortogonal de pesos reduce el problema de gradientes que se desvanecen/explotan porque $\\|Q\\mathbf{x}\\| = \\|\\mathbf{x}\\|$ implica que los valores singulares de $Q$ son todos 1, manteniendo el espectro de la Jacobiana cerca de la identidad.\n\n**Decodificación y codificación simétrica**. En autoencoders simétricos, si el encoder es $f_\\phi: \\mathbb{R}^d \\to \\mathbb{R}^k$ con $k < d$, el decoder $g_\\psi: \\mathbb{R}^k \\to \\mathbb{R}^d$ aproxima una pseudo-inversa: $g_\\psi \\approx f_\\phi^+$. La calidad de la reconstrucción mide cuánta información se preserva — vinculada directamente a la proximidad de $g_\\psi \\circ f_\\phi$ a $\\operatorname{id}_{\\mathbb{R}^d}$."
      },
    ],
    code: `import numpy as np
from scipy import linalg

# ── 1. Verificación de función inversa: f⁻¹ ∘ f = id ─────────────────────────
print("=== Verificación f⁻¹ ∘ f = id ===")
pares = [
    ("exp / log",   np.exp,             np.log,              np.linspace(0.1, 3, 8)),
    ("x²   / √x",  lambda x: x**2,     np.sqrt,             np.linspace(0, 3, 8)),
    ("sin  / arcsin",np.sin,            np.arcsin,           np.linspace(-np.pi/2, np.pi/2, 8)),
    ("tanh / arctanh",np.tanh,          np.arctanh,          np.linspace(-0.99, 0.99, 8)),
]
for nombre, f, finv, xs in pares:
    errores = np.abs(finv(f(xs)) - xs)
    print(f"  {nombre:20s}: error_max = {errores.max():.2e}")

# ── 2. Derivada de la función inversa: (f⁻¹)'(y) = 1 / f'(f⁻¹(y)) ───────────
def deriv_num(f, x, h=1e-7):
    return (f(x+h) - f(x-h)) / (2*h)

print("\\n=== (f⁻¹)'(y) = 1/f'(f⁻¹(y)) ===")
# f(x) = e^x → f⁻¹(y) = log(y),  (f⁻¹)'(y) = 1/y
ys = np.array([0.5, 1.0, 2.0, 4.0])
for y in ys:
    x       = np.log(y)                  # f⁻¹(y)
    df_en_x = np.exp(x)                  # f'(x) = e^x
    formula = 1.0 / df_en_x              # 1/f'(f⁻¹(y))
    numerico= deriv_num(np.log, y)       # (f⁻¹)'(y) numérica
    print(f"  y={y:.1f}  x=log(y)={x:.4f}  1/f'(x)={formula:.4f}  "
          f"numérico={numerico:.4f}  error={abs(formula-numerico):.2e}")

# ── 3. Inversa de matrices: cuadrada, pseudoinversa Moore-Penrose ──────────────
print("\\n=== Inversas de matrices ===")
np.random.seed(42)
# 3.a Inversa exacta (A cuadrada, full rank)
A = np.array([[2., 1.], [5., 3.]])
A_inv = np.linalg.inv(A)
print(f"A =\\n{A}")
print(f"A⁻¹ =\\n{A_inv.round(4)}")
print(f"A @ A⁻¹ =\\n{(A @ A_inv).round(6)}  (debe ser I)")

# 3.b Pseudoinversa (A rectangular)
B = np.array([[1., 2., 3.],
              [4., 5., 6.]])             # B ∈ ℝ^{2×3}, rango 2
B_plus = np.linalg.pinv(B)             # Moore-Penrose: B⁺ ∈ ℝ^{3×2}
print(f"\\nB ∈ ℝ^{{{B.shape[0]}×{B.shape[1]}}} → B⁺ ∈ ℝ^{{{B_plus.shape[0]}×{B_plus.shape[1]}}}")
print(f"B @ B⁺ =\\n{(B @ B_plus).round(6)}  (proyector)")
print(f"B⁺ @ B =\\n{(B_plus @ B).round(6)}  (proyector)")

# 3.c SVD explícita → pseudoinversa
U, S, Vt = np.linalg.svd(B, full_matrices=False)
S_inv = np.diag(1.0 / S)
B_plus_svd = Vt.T @ S_inv @ U.T
print(f"B⁺ via SVD coincide: {np.allclose(B_plus, B_plus_svd)}")

# ── 4. Solución de mínimos cuadrados via pseudoinversa ────────────────────────
print("\\n=== Mínimos cuadrados: x̂ = A⁺ b ===")
# Sistema sobredeterminado: Ax ≈ b, A ∈ ℝ^{5×2}
A_mc = np.column_stack([np.ones(5), np.array([1., 2., 3., 4., 5.])])
b    = np.array([2.1, 3.9, 6.2, 7.8, 10.1])   # y ≈ 2x + 0
x_hat= np.linalg.pinv(A_mc) @ b
print(f"Coefs (intercepto, pendiente) = {x_hat.round(4)}")
print(f"Residuo ‖Ax̂-b‖ = {np.linalg.norm(A_mc @ x_hat - b):.4f}")
print(f"NumPy lstsq:    {np.linalg.lstsq(A_mc, b, rcond=None)[0].round(4)}")

# ── 5. Flujo normalizante: cambio de variable en densidad ─────────────────────
print("\\n=== Flujo normalizante: cambio de variable en densidad ===")
from scipy.stats import norm

# Transformación afín: X = μ + σZ,  Z ~ N(0,1)
mu, sigma = 3.0, 2.0
f_flow    = lambda z: mu + sigma * z          # z → x  (generación)
f_inv     = lambda x: (x - mu) / sigma        # x → z  (inferencia)
log_det_J = np.log(abs(sigma))                # log|det J_f| = log(σ) (escalar)

# Densidad transformada: p_X(x) = p_Z(f⁻¹(x)) / |σ|
xs = np.array([1.0, 3.0, 5.0, 7.0])
for x in xs:
    z      = f_inv(x)
    log_pZ = norm.logpdf(z)
    log_pX = log_pZ - log_det_J              # fórmula de cambio de variable
    pX_ref = norm.logpdf(x, loc=mu, scale=sigma)
    print(f"  x={x:.1f}: z={z:.3f}  log p_X={log_pX:.4f}  ref={pX_ref:.4f}  "
          f"error={abs(log_pX-pX_ref):.2e}")

# ── 6. Bloque RevNet: reconstrucción de activaciones sin guardarlas ────────────
print("\\n=== RevNet: bloque invertible (Gomez et al. 2017) ===")
# Bloque additive coupling:
#   Forward:  y1 = x1 + F(x2),  y2 = x2 + G(y1)
#   Inverse:  x2 = y2 - G(y1),  x1 = y1 - F(x2)
F = lambda u: np.tanh(u * 0.5)      # red arbitraria F
G = lambda u: np.sin(u * 0.3)       # red arbitraria G

np.random.seed(7)
x1, x2 = np.random.randn(4), np.random.randn(4)
print(f"Entrada:  x1={x1.round(3)},  x2={x2.round(3)}")

# Forward
y1 = x1 + F(x2)
y2 = x2 + G(y1)
print(f"Forward:  y1={y1.round(3)},  y2={y2.round(3)}")

# Inverse (sin haber guardado x1, x2)
x2_rec = y2 - G(y1)
x1_rec = y1 - F(x2_rec)
print(f"Inverso:  x1={x1_rec.round(3)},  x2={x2_rec.round(3)}")
print(f"Error x1: {np.abs(x1-x1_rec).max():.2e},  Error x2: {np.abs(x2-x2_rec).max():.2e}")
`,
    related: ["Función", "Dominio y Rango", "Composición de Funciones", "Flujos Normalizantes", "Pseudoinversa y SVD"],
    hasViz: true,
    vizType: "funcionInversa",
  },
  {
    id: 9,
    section: "I. Fundamentos Numéricos y Funcionales",
    sectionCode: "I",
    name: "Función Lineal y No Lineal",
    tags: ["álgebra lineal", "linealidad", "superposición", "activación", "expresividad"],
    definition: "Una función f: V → W entre espacios vectoriales es lineal si satisface aditividad f(x+y) = f(x)+f(y) y homogeneidad f(αx) = αf(x) para todo x, y ∈ V y escalar α. Una función que viola al menos una de estas propiedades es no lineal. La distinción es arquitecturalmente crítica en deep learning: las transformaciones lineales (capas afines) son expresivamente limitadas — su composición sigue siendo lineal — y las funciones de activación no lineales son el mecanismo que dota a las redes de capacidad de aproximación universal.",
    formal: {
      notation: "Sea $f: V \\to W$ con $V, W$ espacios vectoriales sobre $\\mathbb{F}$",
      body: "f \\text{ es lineal} \\iff \\forall\\, \\mathbf{x}, \\mathbf{y} \\in V,\\; \\alpha \\in \\mathbb{F}: \\\\ \\quad (1)\\; f(\\mathbf{x} + \\mathbf{y}) = f(\\mathbf{x}) + f(\\mathbf{y}) \\quad (\\textbf{aditividad}) \\\\ \\quad (2)\\; f(\\alpha \\mathbf{x}) = \\alpha f(\\mathbf{x}) \\quad (\\textbf{homogeneidad}) \\\\ \\text{Equivalentemente: } f(\\alpha\\mathbf{x} + \\beta\\mathbf{y}) = \\alpha f(\\mathbf{x}) + \\beta f(\\mathbf{y}) \\quad (\\textbf{superposición}) \\\\ \\text{Forma matricial: } f(\\mathbf{x}) = A\\mathbf{x},\\; A \\in \\mathbb{F}^{m \\times n} \\quad (\\text{toda transformación lineal } \\mathbb{R}^n \\to \\mathbb{R}^m)",
      geometric: "f \\text{ lineal} \\Rightarrow f(\\mathbf{0}) = \\mathbf{0} \\quad (\\text{pasa por el origen}) \\\\ f \\text{ lineal} \\Rightarrow \\text{subespacios} \\mapsto \\text{subespacios: } f(S) \\text{ subespacio si } S \\text{ subespacio} \\\\ f \\text{ afín (no lineal)}: \\; g(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b},\\; \\mathbf{b} \\neq \\mathbf{0} \\Rightarrow g(\\mathbf{0}) = \\mathbf{b} \\neq \\mathbf{0}",
      properties: [
        "\\text{Composición de lineales es lineal: } g \\circ f \\text{ lineal si } f, g \\text{ lineales} \\Rightarrow \\text{profundidad sola no añade expresividad}",
        "\\ker(f) = \\{\\mathbf{x}: f(\\mathbf{x})=\\mathbf{0}\\} \\text{ subespacio};\\quad \\operatorname{Im}(f) \\text{ subespacio};\\quad \\dim V = \\dim\\ker(f)+\\dim\\operatorname{Im}(f)",
        "\\text{Toda función continua } f: \\mathbb{R}^n \\to \\mathbb{R}^m \\text{ puede aproximarse con capas lineales + no linealidades (UAT)}",
      ],
    },
    intuition: "Una función lineal es la más 'predecible': doblar la entrada dobla la salida, y la suma de entradas produce la suma de salidas. Geométricamente, las transformaciones lineales son rotaciones, reflexiones, escalados y proyecciones — nunca curvan el espacio, solo lo estiran o comprimen. Las no lineales doblan, curvan y pliegan el espacio, lo que es exactamente lo que necesita un clasificador para separar clases que no son linealmente separables. Sin no linealidades, apilar capas en una red neuronal es inútil: diez capas lineales equivalen a una sola capa lineal. Con no linealidades, cada capa 'dobla' el espacio de representación, aumentando exponencialmente la expresividad del modelo.",
    development: [
      {
        label: "Caracterización algebraica y ejemplos canónicos",
        body: "La linealidad es una propiedad algebraica estricta. Algunos ejemplos y contraejemplos fundamentales:\n\n**Lineales** (satisfacen aditividad y homogeneidad):\n- $f(\\mathbf{x}) = A\\mathbf{x}$: multiplicación matricial. Toda transformación lineal entre espacios de dimensión finita tiene esta forma.\n- $f(x) = cx$: escalado. Única función lineal $\\mathbb{R} \\to \\mathbb{R}$ (continua).\n- Proyecciones ortogonales, reflexiones, rotaciones.\n\n**Afines** (lineales salvo traslación — no lineales en sentido estricto):\n- $g(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$: falla homogeneidad ($g(\\mathbf{0}) = \\mathbf{b} \\neq \\mathbf{0}$) y aditividad. En ML se llama coloquialmente 'capa lineal' aunque es técnicamente afín.\n\n**No lineales** (rompen superposición):\n- $f(x) = x^2$: $f(1+1) = 4 \\neq 2 = f(1)+f(1)$.\n- $\\sigma(x) = \\max(0,x)$ (ReLU): $\\sigma(-1+(-1)) = 0 \\neq -2 = \\sigma(-1)+\\sigma(-1)$... aunque ReLU es **positivamente homogénea**: $\\sigma(\\alpha x) = \\alpha\\sigma(x)$ para $\\alpha \\geq 0$.\n- $\\tanh, \\operatorname{sigmoid}, \\operatorname{softmax}$: ninguna satisface aditividad."
      },
      {
        label: "Por qué la composición de lineales es lineal",
        body: "Este es el resultado más crítico para motivar las activaciones no lineales. Si $f(\\mathbf{x}) = A\\mathbf{x}$ y $g(\\mathbf{y}) = B\\mathbf{y}$, entonces:\n$$(g \\circ f)(\\mathbf{x}) = B(A\\mathbf{x}) = (BA)\\mathbf{x} = C\\mathbf{x}$$\n\nUna red de $L$ capas **puramente lineales** (sin activaciones):\n$$f_\\theta(\\mathbf{x}) = W_L W_{L-1} \\cdots W_1 \\mathbf{x} = W_{\\text{eff}}\\mathbf{x}$$\n\nes equivalente a una sola transformación lineal $W_{\\text{eff}} \\in \\mathbb{R}^{d_L \\times d_1}$, independientemente de la profundidad $L$. Esta red solo puede representar funciones que mapean subespacios a subespacios — hipersuperficies planas — lo que la hace incapaz de separar clases no linealmente separables como XOR.\n\nLa **no linealidad** $\\sigma$ rompe este colapso:\n$$f_\\theta(\\mathbf{x}) = W_L \\sigma(W_{L-1} \\cdots \\sigma(W_1 \\mathbf{x}) \\cdots)$$\n\nCada $\\sigma$ 'dobla' el espacio de representación, y la composición de $L$ doblados produce una función de complejidad exponencialmente mayor que ninguna transformación lineal puede replicar."
      },
      {
        label: "Espacio de funciones lineales: Hom(V,W) y su estructura",
        body: "El conjunto de todas las transformaciones lineales $f: V \\to W$ forma el espacio vectorial $\\operatorname{Hom}(V,W) \\cong \\mathbb{R}^{m \\times n}$ (con $\\dim V = n$, $\\dim W = m$). Este espacio tiene dimensión $mn$ y su base canónica son las matrices elementales $E_{ij}$.\n\nEl **Teorema de la Representación** establece la correspondencia:\n$$\\{f: \\mathbb{R}^n \\to \\mathbb{R}^m \\text{ lineal}\\} \\;\\longleftrightarrow\\; \\mathbb{R}^{m \\times n}$$\n\nLas propiedades algebraicas de $f$ se leen directamente de $A$:\n- $f$ inyectiva $\\iff$ $\\operatorname{rank}(A) = n$ $\\iff$ $\\ker(A) = \\{\\mathbf{0}\\}$\n- $f$ sobreyectiva $\\iff$ $\\operatorname{rank}(A) = m$\n- $f$ isomorfismo $\\iff$ $A$ invertible ($n = m$, $\\det(A) \\neq 0$)\n\nEl **Teorema de Rango-Nulidad** (fundamental para entender bottlenecks en redes):\n$$\\operatorname{rank}(A) + \\operatorname{nullity}(A) = n$$\n\nUna capa con $d_{\\text{oculto}} < d_{\\text{entrada}}$ comprime información de manera irreversible: $\\operatorname{nullity}(W) \\geq d_{\\text{entrada}} - d_{\\text{oculto}} > 0$."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "La tensión lineal/no lineal estructura toda la arquitectura de redes neuronales:\n\n**Capas afines + activaciones.** La unidad básica $\\mathbf{h} = \\sigma(W\\mathbf{x} + \\mathbf{b})$ descompone el cómputo en: (1) transformación lineal $W\\mathbf{x}+\\mathbf{b}$ (parámetros entrenables, operación diferenciable en $\\mathcal{O}(nd)$) y (2) no linealidad $\\sigma$ (fija, introduce expresividad).\n\n**Linealidad por tramos de ReLU.** ReLU$(x) = \\max(0,x)$ divide $\\mathbb{R}^n$ en regiones en las que la red se comporta exactamente como una función lineal. Una red ReLU de $L$ capas con ancho $d$ crea hasta $\\mathcal{O}((d/n)^{n(L-1)} d^n)$ regiones lineales — exponencial en la profundidad. Esto explica por qué la profundidad es eficiente: más regiones lineales con menos parámetros.\n\n**Atención como operación bilineal.** La atención en Transformers combina linealidad y no linealidad:\n$$\\operatorname{Attn}(Q,K,V) = \\operatorname{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V$$\nEl producto $QK^\\top$ es bilineal (lineal en $Q$ con $K$ fijo, y viceversa). El softmax introduce no linealidad que permite selección competitiva entre tokens.\n\n**Residual connections y linealidad asegurada.** Las conexiones residuales $\\mathbf{h}_{\\ell+1} = \\mathbf{h}_\\ell + \\mathcal{F}(\\mathbf{h}_\\ell)$ garantizan que la componente identidad (lineal) siempre es alcanzable, facilitando el entrenamiento de redes muy profundas. El Jacobiano $I + J_{\\mathcal{F}}$ tiene siempre autovalores cercanos a 1 cuando $\\|J_{\\mathcal{F}}\\| \\ll 1$."
      },
    ],
    code: `import numpy as np
    
# ── 1. Verificación axiomas de linealidad ─────────────────────────────────────
def es_lineal(f, dom_dim: int, n_tests: int = 2000, tol: float = 1e-8) -> dict:
    """
    Verifica aditividad y homogeneidad de f numéricamente sobre vectores aleatorios.
    f: ℝ^dom_dim → ℝ^m (debe aceptar np.ndarray).
    """
    rng = np.random.default_rng(42)
    falla_adic = falla_hom = 0

    for _ in range(n_tests):
        x = rng.standard_normal(dom_dim)
        y = rng.standard_normal(dom_dim)
        a = rng.standard_normal()

        # Aditividad: f(x+y) == f(x) + f(y)
        if not np.allclose(f(x+y), f(x)+f(y), atol=tol):
            falla_adic += 1

        # Homogeneidad: f(αx) == α·f(x)
        if not np.allclose(f(a*x), a*f(x), atol=tol):
            falla_hom += 1

    return {
        "aditividad":   falla_adic == 0,
        "homogeneidad": falla_hom  == 0,
        "es_lineal":    falla_adic == 0 and falla_hom == 0,
        "fallas_adic":  falla_adic,
        "fallas_hom":   falla_hom,
    }

A = np.array([[1., 2.], [3., -1.], [0., 4.]])   # A ∈ ℝ^{3×2}
b = np.array([1., 0., -1.])

funciones = [
    ("f(x) = Ax       (lineal)",      lambda x: A @ x),
    ("g(x) = Ax + b   (afín)",        lambda x: A @ x + b),
    ("h(x) = x²       (no lineal)",   lambda x: x**2),
    ("r(x) = ReLU(x)  (no lineal)",   lambda x: np.maximum(0, x)),
    ("t(x) = tanh(x)  (no lineal)",   lambda x: np.tanh(x)),
    ("p(x) = |x|      (no lineal)",   lambda x: np.abs(x)),
]
print("=== Verificación de linealidad ===")
for nombre, fn in funciones:
    res = es_lineal(fn, dom_dim=2)
    print(f"  {nombre:35s} | lineal={str(res['es_lineal']):5s} "
          f"| adic={str(res['aditividad']):5s} | hom={str(res['homogeneidad']):5s}")

# ── 2. Composición de lineales sigue siendo lineal ────────────────────────────
print("\\n=== Composición de capas lineales → equivale a una sola ===")
np.random.seed(0)
d = [4, 6, 5, 3]                          # dimensiones de entrada/salida por capa
Ws = [np.random.randn(d[k+1], d[k]) for k in range(len(d)-1)]

# Composición explícita (pase hacia adelante sin activación)
def red_lineal(x):
    for W in Ws: x = W @ x
    return x

# Producto de matrices equivalente
W_eff = Ws[-1]
for W in reversed(Ws[:-1]):
    W_eff = W_eff @ W
print(f"W_eff ∈ ℝ^{{{W_eff.shape[0]}×{W_eff.shape[1]}}}  "
      f"(equivale a {len(Ws)} capas lineales)")

x_test = np.random.randn(d[0])
y_red  = red_lineal(x_test)
y_eff  = W_eff @ x_test
print(f"Red lineal(x)  = {y_red.round(4)}")
print(f"W_eff @ x      = {y_eff.round(4)}")
print(f"Iguales: {np.allclose(y_red, y_eff)}")

# ── 3. XOR: irresoluble con una capa lineal, resoluble con no linealidad ───────
print("\\n=== XOR: lineal vs. no lineal ===")
X_xor = np.array([[0.,0.],[0.,1.],[1.,0.],[1.,1.]])
y_xor = np.array([0., 1., 1., 0.])

# Intento con perceptrón lineal: mínimos cuadrados
A_xor = np.column_stack([X_xor, np.ones(4)])
w_lin = np.linalg.pinv(A_xor) @ y_xor
pred_lin = A_xor @ w_lin
acc_lin  = np.mean((pred_lin >= 0.5) == y_xor)
print(f"  Perceptrón lineal — precisión: {acc_lin:.2f}  (máx posible=0.75 en XOR)")

# Red con 1 capa oculta + ReLU
np.random.seed(7)
W1 = np.array([[ 1.,  1.],
               [ 1.,  1.]])
b1 = np.array([0., -1.])
W2 = np.array([ 1., -2.])
b2 = 0.

def relu(x): return np.maximum(0, x)

preds_nl = []
for xi in X_xor:
    h = relu(W1 @ xi + b1)
    y_hat = W2 @ h + b2
    preds_nl.append(float(y_hat))
preds_nl = np.array(preds_nl)
acc_nl = np.mean((preds_nl >= 0.5) == y_xor)
print(f"  Red ReLU (2→2→1) — precisión: {acc_nl:.2f}  salidas={preds_nl.round(2)}")

# ── 4. Regiones lineales de una red ReLU ──────────────────────────────────────
print("\\n=== Regiones lineales de una red ReLU ===")
# Una red ReLU de 1 capa oculta con H neuronas divide ℝ en ≤ H+1 regiones lineales

def contar_regiones_relu_1d(W1, b1, W2, b2, xmin=-5., xmax=5., N=10000):
    """Cuenta cambios de pendiente de la red en [xmin, xmax]."""
    xs = np.linspace(xmin, xmax, N)
    ys = np.array([W2 @ relu(W1*x + b1) + b2 for x in xs])
    dy = np.diff(ys)
    cambios = np.sum(np.abs(np.diff(np.sign(dy))) > 0)
    return cambios + 1   # nº de regiones lineales ≈ cambios de pendiente + 1

for H in [2, 4, 8, 16]:
    np.random.seed(H)
    w1_1d = np.random.randn(H)
    b1_1d = np.random.randn(H)
    w2_1d = np.random.randn(H)
    b2_1d = float(np.random.randn())
    n_reg = contar_regiones_relu_1d(w1_1d, b1_1d, w2_1d, b2_1d)
    print(f"  H={H:2d} neuronas → {n_reg:3d} regiones lineales  (cota teórica ≤ {H+1})")

# ── 5. Linealidad local: Jacobiana de funciones no lineales ───────────────────
print("\\n=== Jacobiana: aproximación lineal local de funciones no lineales ===")
def jacobiana_num(f, x, eps=1e-6):
    fx = np.atleast_1d(f(x))
    n  = len(np.atleast_1d(x))
    J  = np.zeros((len(fx), n))
    for j in range(n):
        ej = np.zeros(n); ej[j] = eps
        J[:, j] = (f(x+ej) - f(x-ej)) / (2*eps)
    return J

def softmax(z):
    e = np.exp(z - z.max()); return e/e.sum()

z0 = np.array([1., 2., 0.5])
J_sm = jacobiana_num(softmax, z0)
print(f"Jacobiana de softmax en z0={z0}:")
print(f"{J_sm.round(4)}")
print(f"Rango de la Jacobiana = {np.linalg.matrix_rank(J_sm)}  "
      f"(siempre < K porque softmax vive en el símplex → Jacobiana singular)")

# ── 6. Atención: bilinealidad de QKᵀ ────────────────────────────────────────
print("\\n=== Atención: QKᵀ es bilineal ===")
np.random.seed(3)
d_k = 4
Q  = np.random.randn(3, d_k)   # 3 queries
K  = np.random.randn(5, d_k)   # 5 keys
V  = np.random.randn(5, d_k)

scores = Q @ K.T / np.sqrt(d_k)             # bilineal en Q y K
weights = np.array([softmax(s) for s in scores])   # no lineal (softmax)
output  = weights @ V

print(f"Scores QKᵀ/√d  ∈ ℝ^{{{scores.shape[0]}×{scores.shape[1]}}}:\\n{scores.round(3)}")
print(f"Pesos softmax   ∈ ℝ^{{{weights.shape[0]}×{weights.shape[1]}}} (filas suman 1):\\n{weights.round(3)}")
print(f"Output Attn     ∈ ℝ^{{{output.shape[0]}×{output.shape[1]}}}:\\n{output.round(3)}")
`,
    related: ["Función", "Composición de Funciones", "Función de Activación", "Transformación Lineal", "Red Neuronal Feedforward"],
    hasViz: true,
    vizType: "funcionLinealNoLineal",
  },
  {
    id: 10,
    section: "I. Fundamentos Numéricos y Funcionales",
    sectionCode: "I",
    name: "Función Convexa y Cóncava",
    tags: ["optimización", "convexidad", "desigualdad de Jensen", "epígrafo", "gradiente"],
    definition: "Una función f: C → ℝ definida sobre un conjunto convexo C ⊆ ℝⁿ es convexa si para todo par de puntos x, y ∈ C y todo λ ∈ [0,1] se cumple f(λx+(1-λ)y) ≤ λf(x)+(1-λ)f(y); es cóncava si -f es convexa. La convexidad garantiza que todo mínimo local es global, propiedad que fundamenta la convergencia de los algoritmos de optimización en ML. Las funciones de pérdida convexas como MSE o regresión logística tienen paisajes de optimización benignos; las redes neuronales profundas son altamente no convexas, aunque exhiben estructuras locales explotables.",
    formal: {
      notation: "Sea $C \\subseteq \\mathbb{R}^n$ convexo y $f: C \\to \\mathbb{R}$",
      body: "f \\text{ convexa} \\iff \\forall\\, \\mathbf{x}, \\mathbf{y} \\in C,\\; \\lambda \\in [0,1]: \\\\ \\quad f(\\lambda\\mathbf{x} + (1-\\lambda)\\mathbf{y}) \\leq \\lambda f(\\mathbf{x}) + (1-\\lambda)f(\\mathbf{y}) \\\\ \\text{Caracterización diferenciable (orden 1): } f \\text{ convexa} \\iff \\\\ \\quad f(\\mathbf{y}) \\geq f(\\mathbf{x}) + \\nabla f(\\mathbf{x})^\\top(\\mathbf{y}-\\mathbf{x}) \\quad \\forall\\, \\mathbf{x},\\mathbf{y} \\in C \\\\ \\text{Caracterización diferenciable (orden 2): } f \\in C^2 \\Rightarrow \\\\ \\quad f \\text{ convexa} \\iff \\nabla^2 f(\\mathbf{x}) \\succeq 0 \\;\\forall\\,\\mathbf{x}\\in C \\quad (\\text{Hessiana semidefinida positiva})",
      geometric: "\\text{Epígrafo: } \\operatorname{epi}(f) = \\{(\\mathbf{x},t)\\in C\\times\\mathbb{R}: t \\geq f(\\mathbf{x})\\} \\\\ f \\text{ convexa} \\iff \\operatorname{epi}(f) \\text{ es conjunto convexo} \\\\ \\textbf{Desigualdad de Jensen: } f\\left(\\sum_i \\lambda_i \\mathbf{x}_i\\right) \\leq \\sum_i \\lambda_i f(\\mathbf{x}_i),\\quad \\lambda_i \\geq 0,\\; \\sum_i\\lambda_i=1",
      properties: [
        "f \\text{ convexa, diferenciable} \\Rightarrow \\nabla f(\\mathbf{x}^*)=\\mathbf{0} \\iff \\mathbf{x}^* \\text{ mínimo global}",
        "\\alpha f + \\beta g \\text{ convexa si } f,g \\text{ convexas y } \\alpha,\\beta \\geq 0 \\quad (\\text{combinación cónica)}",
        "f \\text{ fuertemente convexa con } \\mu>0: f(\\mathbf{y}) \\geq f(\\mathbf{x})+\\nabla f(\\mathbf{x})^\\top(\\mathbf{y}-\\mathbf{x})+\\frac{\\mu}{2}\\|\\mathbf{y}-\\mathbf{x}\\|^2",
      ],
    },
    intuition: "Una función convexa es aquella cuya gráfica queda por debajo de cualquier cuerda que conecte dos de sus puntos: si tienes dos puntos en la curva y trazas una línea recta entre ellos, la curva queda por debajo. Geométricamente, el epígrafo (la región sobre la gráfica) es un cuenco: cualquier punto interior también está dentro. Esta forma de cuenco tiene una consecuencia dorada para la optimización: no hay valles falsos ni mesetas engañosas — cualquier mínimo que encuentres es el mínimo global. En contraste, el paisaje de pérdida de una red neuronal profunda es como un terreno montañoso lleno de valles locales, puntos de silla y mesetas planas.",
    development: [
      {
        label: "Geometría de la convexidad: epígrafo, conjuntos de nivel y soporte",
        body: "La convexidad de una función se caracteriza completamente por la geometría de tres objetos:\n\n**Epígrafo**: $\\operatorname{epi}(f) = \\{(\\mathbf{x},t): t \\geq f(\\mathbf{x})\\}$. Una función es convexa si y solo si su epígrafo es un **conjunto convexo**. Esto justifica que el 'cuenco' sea la imagen visual correcta.\n\n**Conjuntos de nivel** (o de sublevel): $\\mathcal{L}_\\alpha(f) = \\{\\mathbf{x}: f(\\mathbf{x}) \\leq \\alpha\\}$. Si $f$ es convexa, todos sus conjuntos de nivel son convexos (aunque el recíproco es falso — quasiconvexidad). Esto es fundamental para el método de proyección de gradiente en dominios restringidos.\n\n**Hiperplano de soporte**: para $f$ convexa diferenciable, el hiperplano tangente en cualquier punto $(\\mathbf{x}_0, f(\\mathbf{x}_0))$ es un **soporte global** del epígrafo:\n$$f(\\mathbf{y}) \\geq f(\\mathbf{x}_0) + \\nabla f(\\mathbf{x}_0)^\\top(\\mathbf{y}-\\mathbf{x}_0) \\quad \\forall\\, \\mathbf{y}$$\n\nEsto significa que la aproximación lineal (gradiente) siempre **subestima** la función — propiedad que garantiza el descenso en métodos de gradiente."
      },
      {
        label: "Convexidad fuerte y condición de Lipschitz del gradiente",
        body: "Dos condiciones más fuertes que la convexidad simple son cruciales para el análisis de convergencia en optimización:\n\n**Fuertemente convexa** con parámetro $\\mu > 0$:\n$$f(\\mathbf{y}) \\geq f(\\mathbf{x}) + \\nabla f(\\mathbf{x})^\\top(\\mathbf{y}-\\mathbf{x}) + \\frac{\\mu}{2}\\|\\mathbf{y}-\\mathbf{x}\\|^2$$\n\nEquivalente a que $\\nabla^2 f(\\mathbf{x}) \\succeq \\mu I$ en todo punto. Implica que la función crece al menos cuadráticamente lejos del mínimo — hay un único mínimo global y el descenso de gradiente converge a velocidad lineal.\n\n**Gradiente Lipschitz** con constante $L > 0$ ($L$-smooth):\n$$\\|\\nabla f(\\mathbf{x}) - \\nabla f(\\mathbf{y})\\| \\leq L\\|\\mathbf{x}-\\mathbf{y}\\| \\quad \\Leftrightarrow \\quad \\nabla^2 f(\\mathbf{x}) \\preceq LI$$\n\nCombinando ambas condiciones ($0 < \\mu \\leq L$), el **número de condición** $\\kappa = L/\\mu$ determina la velocidad de convergencia de GD:\n$$f(\\mathbf{x}_t) - f^* \\leq \\left(1-\\frac{\\mu}{L}\\right)^t [f(\\mathbf{x}_0)-f^*]$$\n\n$\\kappa$ grande (mal condicionada) → convergencia lenta → justifica el uso de precondicionamiento y métodos de segundo orden como Newton o L-BFGS."
      },
      {
        label: "Desigualdad de Jensen y sus consecuencias",
        body: "La **Desigualdad de Jensen** es la extensión de la definición de convexidad a combinaciones convexas arbitrarias:\n$$f\\left(\\mathbb{E}[X]\\right) \\leq \\mathbb{E}[f(X)]$$\n\npara cualquier variable aleatoria $X$ integrable y $f$ convexa. Esta desigualdad tiene consecuencias ubicuas:\n\n- **Media aritmética vs. geométrica**: $f(x) = e^x$ es convexa, entonces $e^{\\mathbb{E}[\\log X]} \\leq \\mathbb{E}[X]$ — la media geométrica no supera la aritmética.\n- **Cota del evidence (ELBO)**: en VAEs, la función de log-verosimilitud satisface (con $f = -\\log$, convexa):\n$$\\log p(\\mathbf{x}) = \\log \\mathbb{E}_{q}\\left[\\frac{p(\\mathbf{x},\\mathbf{z})}{q(\\mathbf{z})}\\right] \\geq \\mathbb{E}_q\\left[\\log \\frac{p(\\mathbf{x},\\mathbf{z})}{q(\\mathbf{z})}\\right] = \\text{ELBO}$$\n- **Divergencia KL no negativa**: $D_{KL}(p\\|q) \\geq 0$ se deduce de Jensen aplicada a $f = -\\log$ (convexa) sobre $p/q$."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "La convexidad estructura profundamente qué problemas de ML son 'resolubles' y cuáles son difíciles:\n\n**Pérdidas convexas en modelos lineales.** La regresión lineal (MSE), la regresión logística (log-loss), las SVMs (hinge loss) y la regresión ridge tienen funciones de pérdida convexas en $\\theta$. Esto garantiza convergencia de SGD al mínimo global y ausencia de óptimos locales espurios.\n\n**No convexidad de redes profundas.** La pérdida $\\mathcal{L}(\\theta)$ de una red neuronal profunda es **altamente no convexa** en $\\theta$: $\\mathcal{L}(W_2 W_1 \\mathbf{x})$ ya no es convexa en $(W_1, W_2)$ aunque $\\ell$ sea convexa. Sin embargo:\n- Los mínimos locales tienden a tener valor similar al global en redes sobreparametrizadas.\n- Los puntos de silla (saddle points) son más problemáticos que los mínimos locales.\n- El descenso de gradiente estocástico (SGD) con momentum escapa de puntos de silla con alta probabilidad.\n\n**Batch Normalization y convexidad local.** BatchNorm reparametriza la pérdida de forma que la Hessiana local sea mejor condicionada ($\\kappa$ más pequeño), acelerando la convergencia aunque la pérdida global sigue siendo no convexa.\n\n**ELBO y optimización variacional.** El objetivo del VAE es el ELBO: $\\mathcal{L}(\\phi,\\theta) = \\mathbb{E}_{q_\\phi}[\\log p_\\theta(\\mathbf{x}|\\mathbf{z})] - D_{KL}(q_\\phi(\\mathbf{z}|\\mathbf{x})\\|p(\\mathbf{z}))$. El término $D_{KL} \\geq 0$ (por Jensen) actúa como regularizador convexo sobre el espacio latente."
      },
    ],
    code: `import numpy as np
from typing import Callable

# ── 1. Verificación numérica de convexidad ────────────────────────────────────
def es_convexa(f: Callable, dom: tuple, n_tests: int = 3000, tol: float = 1e-8) -> dict:
    """
    Verifica la desigualdad de Jensen: f(λx+(1-λ)y) ≤ λf(x)+(1-λ)f(y)
    para vectores aleatorios en dom = (xmin, xmax).
    """
    rng = np.random.default_rng(42)
    xmin, xmax = dom
    fallas = 0
    max_viol = 0.0

    for _ in range(n_tests):
        x   = rng.uniform(xmin, xmax)
        y   = rng.uniform(xmin, xmax)
        lam = rng.uniform(0, 1)
        lhs = f(lam*x + (1-lam)*y)
        rhs = lam*f(x) + (1-lam)*f(y)
        viol = lhs - rhs
        if viol > tol:
            fallas += 1
            max_viol = max(max_viol, viol)

    return {"convexa": fallas == 0, "fallas": fallas,
            "violación_máx": max_viol, "tests": n_tests}

print("=== Verificación de convexidad (Jensen numérico) ===")
funciones = [
    ("x²              ", lambda x: x**2,             (-3, 3)),
    ("eˣ              ", lambda x: np.exp(x),         (-3, 3)),
    ("|x|             ", lambda x: abs(x),            (-3, 3)),
    ("-log(x)  [x>0]  ", lambda x: -np.log(x),       (0.01, 3)),
    ("sin(x)   [no]   ", lambda x: np.sin(x),         (-np.pi, np.pi)),
    ("-x²      [cónc] ", lambda x: -x**2,             (-3, 3)),
    ("x³       [no]   ", lambda x: x**3,              (-3, 3)),
    ("max(0,x) [ReLU] ", lambda x: max(0., x),        (-3, 3)),
]
for nombre, fn, dom in funciones:
    res = es_convexa(fn, dom)
    simbolo = "✓ convexa " if res["convexa"] else "✗ no conv."
    print(f"  {nombre}: {simbolo}  |  viol_max={res['violación_máx']:.2e}")

# ── 2. Condición de orden 2: Hessiana semidefinida positiva ────────────────────
def hessiana_1d(f: Callable, x: float, h: float = 1e-5) -> float:
    """Segunda derivada numérica: f''(x) ≥ 0 ↔ f convexa."""
    return (f(x+h) - 2*f(x) + f(x-h)) / h**2

print("\\n=== Criterio de orden 2: f''(x) ≥ 0 ===")
xs = np.linspace(-2, 2, 7)
for nombre, fn in [("x²", lambda x: x**2),
                   ("eˣ", np.exp),
                   ("sin(x)", np.sin),
                   ("-x²", lambda x: -x**2)]:
    d2 = [hessiana_1d(fn, x) for x in xs]
    min_d2 = min(d2)
    print(f"  {nombre:8s}: min f''={min_d2:+.4f}  → {'convexa' if min_d2>=-1e-6 else 'no convexa'}")

# ── 3. Desigualdad de Jensen ───────────────────────────────────────────────────
print("\\n=== Desigualdad de Jensen: f(E[X]) ≤ E[f(X)] ===")
np.random.seed(0)
X = np.random.exponential(scale=2.0, size=100_000)   # X ~ Exp(2)

for nombre, fn in [("f=x²   (convexa)", lambda x: x**2),
                   ("f=eˣ   (convexa)", lambda x: np.exp(np.clip(x, None, 5))),
                   ("f=-log (convexa)", lambda x: -np.log(np.maximum(x, 1e-9))),
                   ("f=-x²  (cóncava)", lambda x: -x**2)]:
    fEX   = fn(np.mean(X))           # f(E[X])
    EfX   = np.mean(fn(X))           # E[f(X)]
    jensen_ok = fEX <= EfX + 1e-3    # ≤ para convexas
    print(f"  {nombre}: f(E[X])={fEX:.4f}  E[f(X)]={EfX:.4f}  "
          f"  {'≤ ✓' if jensen_ok else '> ✗'}")

# ── 4. KL ≥ 0 por Jensen ─────────────────────────────────────────────────────
print("\\n=== KL ≥ 0 como consecuencia de Jensen ===")
def kl_divergence(p: np.ndarray, q: np.ndarray) -> float:
    """D_KL(p||q) = E_p[log(p/q)] = -E_p[log(q/p)] ≥ 0 por Jensen (f=-log convexa)."""
    mask = (p > 0) & (q > 0)
    return float(np.sum(p[mask] * np.log(p[mask] / q[mask])))

# Diferentes pares (p, q) sobre {0,...,4}
K = 5
pares = [
    ("p = q (iguales)",    np.array([0.2,0.2,0.2,0.2,0.2]), np.array([0.2,0.2,0.2,0.2,0.2])),
    ("p≈q   (parecidas)", np.array([0.3,0.25,0.2,0.15,0.1]),np.array([0.28,0.24,0.22,0.14,0.12])),
    ("p≠q   (distintas)", np.array([0.7,0.2,0.05,0.03,0.02]),np.array([0.1,0.1,0.3,0.3,0.2])),
]
for nombre, p, q in pares:
    kl = kl_divergence(p, q)
    print(f"  {nombre}: D_KL={kl:.5f}  ≥ 0: {kl >= -1e-10}")

# ── 5. Convexidad y convergencia de GD ────────────────────────────────────────
print("\\n=== Convergencia de GD: convexa vs. fuertemente convexa ===")
def descenso_gradiente(grad_f: Callable, x0: float, lr: float,
                       n_iter: int) -> list[float]:
    x = x0; traj = [x]
    for _ in range(n_iter):
        x = x - lr * grad_f(x)
        traj.append(x)
    return traj

# f1(x) = x²  → μ=2, L=2, κ=1  (bien condicionada)
# f2(x) = x²/50 + x  → mal condicionada cerca de 0 (ilustrativo)
# Usamos: f(x) = 0.5·μ·x² y variamos κ
for nombre, mu, L in [("κ=1   (μ=L=1)",   1.0, 1.0),
                      ("κ=10  (μ=1,L=10)", 1.0, 10.0),
                      ("κ=100 (μ=1,L=100)",1.0, 100.0)]:
    # f(x) = L/2·x² — convexa fuertemente con κ=L/μ
    grad = lambda x, L=L: L*x       # gradiente de L/2·x²
    f_val= lambda x, L=L: L/2*x**2
    lr   = 1.0 / L                   # paso óptimo para GD en smooth convex
    traj = descenso_gradiente(grad, x0=5.0, lr=lr, n_iter=50)
    # Converge a 0 (mínimo de f)
    iter_to_eps = next((i for i,x in enumerate(traj) if abs(x)<0.01), len(traj))
    rate = (1 - mu/L)
    print(f"  {nombre}: tasa=(1-μ/L)={rate:.3f}  iters_hasta_|x|<0.01: {iter_to_eps}")

# ── 6. ELBO: lower bound por Jensen en VAE ───────────────────────────────────
print("\\n=== ELBO: log p(x) ≥ ELBO (por Jensen, -log convexa) ===")
# Modelo generativo: p(z)=N(0,1), p(x|z)=N(z,0.1²)
# Aproximación variacional: q(z|x)=N(mu_q, sig_q²)
# log p(x) ≈ log∫p(x|z)p(z)dz  — intractable
# ELBO = E_q[log p(x|z)] - KL(q||p)

from scipy.stats import norm

def elbo(x_obs: float, mu_q: float, sig_q: float,
         sig_likelihood: float = 0.1, n_mc: int = 10_000) -> float:
    z_samples = np.random.normal(mu_q, sig_q, n_mc)
    log_pxz   = norm.logpdf(x_obs, loc=z_samples, scale=sig_likelihood)
    log_pz    = norm.logpdf(z_samples, 0, 1)
    log_qz    = norm.logpdf(z_samples, mu_q, sig_q)
    return float(np.mean(log_pxz + log_pz - log_qz))

# log p(x) por MC (con prior como propuesta, importance weighting)
def log_px_mc(x_obs: float, sig_likelihood: float = 0.1,
              n_mc: int = 100_000) -> float:
    z = np.random.normal(0, 1, n_mc)
    log_w = norm.logpdf(x_obs, z, sig_likelihood)
    # log E[w] via logsumexp
    return float(np.log(np.mean(np.exp(log_w - log_w.max()))) + log_w.max())

np.random.seed(1)
x_obs = 1.5
log_px = log_px_mc(x_obs)

print(f"  x_obs={x_obs},  log p(x) ≈ {log_px:.4f}")
for mu_q, sig_q in [(1.5,0.1),(1.0,0.5),(0.0,1.0)]:
    elbo_val = elbo(x_obs, mu_q, sig_q)
    gap = log_px - elbo_val
    print(f"  q=N({mu_q},{sig_q}²): ELBO={elbo_val:.4f}  "
          f"gap(log p - ELBO)={gap:.4f}  ≥0: {gap>=-1e-3}")
`,
    related: ["Función", "Función Lineal y No Lineal", "Gradiente y Hessiana", "Descenso de Gradiente", "ELBO y VAE"],
    hasViz: true,
    vizType: "funcionConvexaConcava",
  },
  {
    id: 11,
    section: "I. Fundamentos Numéricos y Funcionales",
    sectionCode: "I",
    name: "Límites y Continuidad",
    tags: ["análisis real", "épsilon-delta", "continuidad", "límite", "topología"],
    definition: "El límite de una función f en un punto x₀ es el valor L al que f(x) se aproxima arbitrariamente cuando x se acerca a x₀ sin necesariamente igualarlo. Formalmente (Cauchy-Weierstrass): lim_{x→x₀} f(x) = L iff para todo ε > 0 existe δ > 0 tal que 0 < |x−x₀| < δ implica |f(x)−L| < ε. Una función es continua en x₀ si el límite existe, f está definida en x₀, y ambos coinciden. La continuidad es la condición mínima de regularidad para garantizar propiedades como el Teorema del Valor Intermedio, y es requisito implícito en casi toda la maquinaria del cálculo diferencial e integral que sustenta el aprendizaje automático.",
    formal: {
      notation: "Sea $f: D \\subseteq \\mathbb{R}^n \\to \\mathbb{R}^m$ y $\\mathbf{x}_0$ un punto de acumulación de $D$",
      body: "\\lim_{\\mathbf{x} \\to \\mathbf{x}_0} f(\\mathbf{x}) = L \\quad \\overset{\\text{def}}{\\iff} \\quad \\forall\\,\\varepsilon > 0,\\; \\exists\\,\\delta > 0: \\\\ \\quad 0 < \\|\\mathbf{x} - \\mathbf{x}_0\\| < \\delta \\implies \\|f(\\mathbf{x}) - L\\| < \\varepsilon \\\\ \\textbf{Continuidad en } \\mathbf{x}_0: \\\\ \\quad (1)\\; f(\\mathbf{x}_0) \\text{ definida} \\quad (2)\\; \\lim_{\\mathbf{x}\\to\\mathbf{x}_0}f(\\mathbf{x}) \\text{ existe} \\quad (3)\\; \\lim_{\\mathbf{x}\\to\\mathbf{x}_0}f(\\mathbf{x}) = f(\\mathbf{x}_0) \\\\ \\textbf{Equivalente secuencial: } f \\text{ continua en } \\mathbf{x}_0 \\iff \\\\ \\quad \\forall\\,(\\mathbf{x}_n) \\to \\mathbf{x}_0: f(\\mathbf{x}_n) \\to f(\\mathbf{x}_0)",
      geometric: "f \\text{ uniformemente continua en } D: \\forall\\,\\varepsilon>0,\\;\\exists\\,\\delta>0 \\text{ (independiente de }\\mathbf{x}_0\\text{)}: \\\\ \\|\\mathbf{x}-\\mathbf{y}\\|<\\delta \\implies \\|f(\\mathbf{x})-f(\\mathbf{y})\\|<\\varepsilon \\\\ \\text{Toda función Lipschitz es unif. continua (con }\\delta=\\varepsilon/L\\text{); toda unif. continua en compacto es Lipschitz si }C^1",
      properties: [
        "\\text{Álgebra de límites: } \\lim(f \\pm g) = \\lim f \\pm \\lim g,\\quad \\lim(fg)=(\\lim f)(\\lim g),\\quad \\lim(f/g)=\\lim f/\\lim g\\;(\\lim g\\neq 0)",
        "\\text{Teorema de composición: } g \\text{ continua en } L,\\; \\lim_{x\\to x_0}f(x)=L \\Rightarrow \\lim_{x\\to x_0}(g\\circ f)(x)=g(L)",
        "\\text{Heine-Cantor: } f \\text{ continua en compacto } K \\Rightarrow f \\text{ uniformemente continua en } K",
      ],
    },
    intuition: "El límite captura la idea de 'acercarse sin llegar': ¿hacia dónde va $f(x)$ cuando $x$ se acerca a $x_0$? La definición $\\varepsilon$-$\\delta$ traduce esto en un reto-respuesta: tú fijas un radio de tolerancia $\\varepsilon$ alrededor del valor objetivo $L$; yo debo encontrar un radio $\\delta$ alrededor de $x_0$ tal que cualquier $x$ dentro de ese radio produzca un $f(x)$ dentro de tu tolerancia. La continuidad es simplemente que el límite coincide con el valor real de la función — no hay saltos, agujeros ni explosiones. En redes neuronales, la continuidad de las activaciones y las funciones de pérdida garantiza que pequeñas perturbaciones en los pesos producen pequeños cambios en la salida — condición sin la cual el gradiente no tendría significado.",
    development: [
      {
        label: "Definición ε-δ: el contrato de aproximación",
        body: "La definición formal de Cauchy-Weierstrass para $\\lim_{x \\to x_0} f(x) = L$ establece un protocolo iterado:\n\n1. **Adversario** elige $\\varepsilon > 0$ (la tolerancia de salida deseada).\n2. **Demostrador** responde con $\\delta > 0$ (radio de entrada suficientemente pequeño).\n3. Se verifica: $0 < |x - x_0| < \\delta \\implies |f(x) - L| < \\varepsilon$.\n\nNota crítica: $0 < |x - x_0|$ excluye exactamente $x_0$ — el límite no depende del valor de $f$ en $x_0$ (ni siquiera requiere que $f$ esté definida ahí).\n\nPara demostrar límites concretos, la estrategia es construir $\\delta$ como función de $\\varepsilon$. Ejemplo: $\\lim_{x\\to 2} (3x-1) = 5$:\n$$|f(x)-L| = |3x-1-5| = 3|x-2| < \\varepsilon \\iff |x-2| < \\frac{\\varepsilon}{3}$$\n\nEl demostrador elige $\\delta = \\varepsilon/3$. Esta construcción lineal siempre es posible para funciones Lipschitz con constante $L$: basta tomar $\\delta = \\varepsilon/L$."
      },
      {
        label: "Tipos de discontinuidad y su relevancia numérica",
        body: "Las discontinuidades se clasifican según el comportamiento de los límites laterales $f(x_0^-)$ y $f(x_0^+)$:\n\n| Tipo | Condición | Ejemplo | Relevancia en ML |\n|---|---|---|---|\n| **Evitable** | $\\lim$ existe pero $\\neq f(x_0)$ | $\\sin(x)/x$ en $x=0$ | Raro; se corrige redefiniendo |\n| **Salto** | $f(x_0^-) \\neq f(x_0^+)$, ambos finitos | Escalón de Heaviside | Gradiente indefinido (ReLU en 0) |\n| **Infinita** | $|f(x)| \\to \\infty$ | $1/x$ en $x=0$ | Overflow numérico, log(0) |\n| **Esencial** | No existe ningún límite lateral | $\\sin(1/x)$ en $x=0$ | Inestabilidad caótica |\n\nLa discontinuidad de salto de ReLU en $x=0$ es la más relevante en DL: técnicamente $\\text{ReLU}'(0)$ no existe, pero en la práctica se asigna un **subgradiente** $\\partial\\text{ReLU}(0) \\in [0,1]$ (tipicamente $0$). La teoría del subgradiente extiende el análisis de convergencia al caso no diferenciable."
      },
      {
        label: "Continuidad uniforme, Lipschitz y extensión de funciones",
        body: "Hay una jerarquía de condiciones de regularidad, cada una más fuerte que la anterior:\n$$\\text{Lipschitz} \\subsetneq \\text{Unif. continua} \\subsetneq \\text{Continua} \\subsetneq \\text{Semicontinua}$$\n\n**Lipschitz continua** con constante $L$: $|f(x)-f(y)| \\leq L|x-y|$. Implica que el gradiente (si existe) está acotado por $L$ en norma. Es la condición que usamos en el análisis de convergencia de GD: si $\\|\\nabla f\\| \\leq L$, el paso $\\eta < 2/L$ garantiza descenso.\n\n**Heine-Cantor**: toda función continua en un compacto $K \\subset \\mathbb{R}^n$ es uniformemente continua. Esto justifica que las funciones de pérdida (evaluadas en conjuntos de datos acotados) tengan $\\delta$ global independiente del punto — la optimización es 'estable' en el dominio de datos.\n\n**Extensión de Tietze**: toda función continua sobre un cerrado $A \\subset \\mathbb{R}^n$ admite extensión continua a todo $\\mathbb{R}^n$ preservando el supremo. Fundamento teórico detrás de la interpolación y la generalización de modelos a nuevas entradas."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "La continuidad es el requisito de regularidad mínimo que permea toda la maquinaria de ML:\n\n**Diferenciabilidad requiere continuidad.** El gradiente $\\nabla_\\theta \\mathcal{L}$ solo existe si $\\mathcal{L}$ es continua en $\\theta$ (y más: diferenciable). Si las funciones de pérdida o activación tuvieran discontinuidades de salto en regiones visitadas por el optimizador, el descenso de gradiente perdería sentido.\n\n**ReLU y el subgradiente.** ReLU$(x) = \\max(0,x)$ es continua en todo $\\mathbb{R}$ (incluyendo $x=0$) pero no diferenciable en $x=0$. PyTorch asigna $\\text{ReLU}'(0) = 0$ por convención — una elección de subgradiente. La continuidad garantiza que la aproximación por diferencias finitas $[f(x+h)-f(x)]/h$ tiene límite para $x \\neq 0$.\n\n**Continuidad de la función de pérdida y paisaje de optimización.** La continuidad de $\\mathcal{L}$ en $\\theta$ garantiza que pequeñas perturbaciones en pesos (ruido SGD, dropout, weight decay) producen cambios pequeños y predecibles en la pérdida. Esta propiedad es la base de las garantías de generalización via estabilidad algorítmica (Bousquet & Elisseeff 2002).\n\n**Límites en secuencias y convergencia de entrenamientos.** La convergencia de SGD se formula como: ¿existe $\\theta^*$ tal que $\\theta_t \\to \\theta^*$? Para definir '$\\to$' necesitamos topología, y la continuidad de $\\mathcal{L}$ garantiza que $\\mathcal{L}(\\theta_t) \\to \\mathcal{L}(\\theta^*)$. Sin continuidad, la secuencia de pérdidas podría converger sin que los pesos converjan — el llamado problema de identificabilidad.\n\n**Límites y normalización numérica.** Expresiones como $\\operatorname{softmax}(\\mathbf{z})_k = e^{z_k}/\\sum_j e^{z_j}$ requieren análisis de límite para su estabilización: cuando $z_k \\to \\pm\\infty$, el valor tiende a $0$ o $1$, y el truco log-sum-exp explota la continuidad del logaritmo para evitar overflow sin cambiar el límite."
      },
    ],
    code: `import numpy as np
from typing import Callable, Optional

# ── 1. Verificación numérica de límite (ε-δ) ─────────────────────────────────
def verificar_limite(
    f: Callable[[float], float],
    x0: float,
    L: float,
    epsilons: list[float] = [0.1, 0.01, 0.001],
    n_puntos: int = 10_000,
) -> dict:
    """
    Para cada ε, halla empíricamente el mayor δ tal que
    0 < |x-x0| < δ → |f(x)-L| < ε.
    """
    resultados = {}
    xs = np.concatenate([
        np.linspace(x0 - 1, x0 - 1e-9, n_puntos//2),
        np.linspace(x0 + 1e-9, x0 + 1, n_puntos//2),
    ])
    try:
        ys = np.array([f(x) for x in xs])
        validos = np.isfinite(ys)
        xs, ys = xs[validos], ys[validos]
    except Exception:
        return {"error": "Función no evaluable"}

    for eps in epsilons:
        dentro_eps = np.abs(ys - L) < eps          # |f(x)-L| < ε
        dist_x0    = np.abs(xs - x0)
        if dentro_eps.all():
            delta = 1.0   # delta = ∞ en la práctica
        else:
            # δ_max = mínima distancia al x0 donde falla la condición
            falla = ~dentro_eps
            delta = dist_x0[falla].min() if falla.any() else 1.0
        resultados[eps] = {"delta": float(delta), "ratio_delta_eps": float(delta/eps)}
    return resultados

print("=== Verificación numérica de límites ===")
casos = [
    ("(3x-1) → 5   en x=2",   lambda x: 3*x-1,             x0:=2.0,  L:=5.0),
    ("sin(x)/x → 1 en x=0",   lambda x: np.sin(x)/x,       x0:=0.0,  L:=1.0),
    ("(x²-1)/(x-1)→2 en x=1", lambda x: (x**2-1)/(x-1),   x0:=1.0,  L:=2.0),
    ("|x|/x → ±1  en x=0",    lambda x: np.sign(x),        x0:=0.0,  L:=0.0),   # no existe
]
# Nota: la sintaxis anterior usa := de walrus; adaptamos para claridad:
CASOS = [
    ("(3x-1) → 5   en x=2",   lambda x: 3*x-1,                     2.0, 5.0),
    ("sin(x)/x → 1 en x=0",   lambda x: np.sin(x)/(x+1e-300),      0.0, 1.0),
    ("(x²-1)/(x-1)→2 en x=1", lambda x: (x**2-1)/(x-1+1e-300),    1.0, 2.0),
    ("sign(x) → ? en x=0",    lambda x: float(np.sign(x)) if x!=0 else 0., 0.0, 0.0),
]
for nombre, fn, x0, L in CASOS:
    res = verificar_limite(fn, x0, L, epsilons=[0.1, 0.01, 0.001])
    if "error" in res: continue
    deltas = [f"ε={e:.3f}→δ≈{v['delta']:.4f}" for e,v in res.items()]
    print(f"  {nombre}")
    print(f"    {' | '.join(deltas)}")

# ── 2. Tipos de discontinuidad ────────────────────────────────────────────────
print("\\n=== Clasificación de discontinuidades ===")
def clasificar_discontinuidad(
    f: Callable, x0: float, h: float = 1e-7
) -> str:
    """Clasifica la discontinuidad de f en x0 usando límites laterales."""
    try:
        L_izq = f(x0 - h)
        L_der = f(x0 + h)
    except Exception:
        return "infinita o no definida"

    if not (np.isfinite(L_izq) and np.isfinite(L_der)):
        return "infinita"

    try:
        f_x0 = f(x0)
    except Exception:
        f_x0 = None

    if np.abs(L_izq - L_der) < 1e-5:          # límite lateral único
        L = (L_izq + L_der) / 2
        if f_x0 is None or not np.isfinite(f_x0):
            return "evitable (f no definida en x0)"
        if np.abs(f_x0 - L) < 1e-5:
            return "CONTINUA"
        return f"evitable (lim={L:.4f}, f(x0)={f_x0:.4f})"
    else:
        return f"salto (L-={L_izq:.4f}, L+={L_der:.4f})"

funcs_disc = [
    ("sin(x)/x  en x=0", lambda x: np.sin(x)/x if x!=0 else 1.0, 0.0),
    ("sign(x)   en x=0", lambda x: float(np.sign(x)),             0.0),
    ("1/x       en x=0", lambda x: 1.0/x,                         0.0),
    ("ReLU(x)   en x=0", lambda x: max(0., x),                    0.0),
    ("x²        en x=1", lambda x: x**2,                          1.0),
    ("floor(x)  en x=1", lambda x: float(np.floor(x)),            1.0),
]
for nombre, fn, x0 in funcs_disc:
    tipo = clasificar_discontinuidad(fn, x0)
    print(f"  {nombre:25s}: {tipo}")

# ── 3. Continuidad uniforme vs. puntual ───────────────────────────────────────
print("\\n=== Continuidad: δ global (uniforme) vs. δ puntual ===")
def delta_puntual(f, x0, eps, dom, n=5_000):
    """Mayor δ tal que |f(x)-f(x0)| < eps para x en (x0-δ, x0+δ) ∩ dom."""
    xs = np.linspace(dom[0], dom[1], n)
    ys = np.array([f(x) for x in xs])
    fx0 = f(x0)
    falla = np.abs(ys - fx0) >= eps
    dist = np.abs(xs - x0)
    if not falla.any():
        return dom[1] - dom[0]
    return float(dist[falla].min())

eps = 0.1
print(f"  ε = {eps}  — comparando δ en distintos puntos")
for nombre, fn, dom in [
    ("sin(x)  [unif. cont.]", np.sin,          (-np.pi, np.pi)),
    ("x²      [no unif. cont.]", lambda x:x**2, (-10., 10.)),
    ("1/x     [no cont. en 0]", lambda x:1/x,  (0.1, 5.)),
]:
    puntos = np.linspace(dom[0]+0.1, dom[1]-0.1, 5)
    deltas = [delta_puntual(fn, x, eps, dom) for x in puntos]
    print(f"  {nombre:35s}: δ_min={min(deltas):.4f}  δ_max={max(deltas):.4f}")

# ── 4. Continuidad Lipschitz y cota del gradiente ────────────────────────────
print("\\n=== Constante de Lipschitz y cota del gradiente ===")
def lipschitz_const(f, dom, n=10_000):
    xs = np.linspace(dom[0], dom[1], n)
    ys = np.array([f(x) for x in xs])
    dx = np.diff(xs); dy = np.diff(ys)
    ratios = np.abs(dy) / np.abs(dx + 1e-300)
    return float(ratios.max())

activaciones = [
    ("sigmoid  σ(x)",  lambda x: 1/(1+np.exp(-x)), (-10., 10.)),
    ("tanh(x)",        np.tanh,                      (-5.,  5.)),
    ("ReLU(x)",        lambda x: np.maximum(0., x),  (-5.,  5.)),
    ("GELU(x)",        lambda x: x*0.5*(1+np.tanh(0.7978*(x+0.044715*x**3))),(-5.,5.)),
    ("SiLU(x)=x·σ(x)", lambda x: x/(1+np.exp(-x)),  (-5.,  5.)),
]
for nombre, fn, dom in activaciones:
    L = lipschitz_const(fn, dom)
    print(f"  {nombre:22s}: L ≈ {L:.4f}  → lr_max = 2/L ≈ {2/L:.4f}")

# ── 5. Límites en normalización numérica (softmax) ────────────────────────────
print("\\n=== Límites numéricos en softmax ===")
def softmax_naive(z):
    return np.exp(z) / np.sum(np.exp(z))

def softmax_stable(z):
    z = z - z.max()         # truco log-sum-exp: desplazar preserva el límite
    return np.exp(z) / np.sum(np.exp(z))

casos_softmax = [
    ("normal",   np.array([1., 2., 3.])),
    ("grande+",  np.array([1000., 1001., 1002.])),  # overflow en naive
    ("grande-",  np.array([-1000., -1001., -1002.])),  # underflow → 0
]
for nombre, z in casos_softmax:
    try:
        naive  = softmax_naive(z)
        naive_ok = np.isfinite(naive).all()
    except Exception:
        naive_ok = False; naive = None
    stable = softmax_stable(z)
    print(f"  {nombre:10s}: naive_ok={naive_ok}  "
          f"stable={stable.round(4)}  Σ={stable.sum():.6f}")

# ── 6. Continuidad y estabilidad de entrenamiento ────────────────────────────
print("\\n=== Continuidad y estabilidad: perturbación de pesos ===")
np.random.seed(42)
W = np.random.randn(8, 4)
x = np.random.randn(4)

relu = lambda v: np.maximum(0., v)

def forward(W, x): return relu(W @ x)

y0 = forward(W, x)
for noise_std in [1e-4, 1e-3, 1e-2, 1e-1]:
    dW = np.random.randn(*W.shape) * noise_std
    y1 = forward(W + dW, x)
    perturbacion_entrada = noise_std * np.sqrt(W.size)   # ‖ΔW‖_F ≈
    perturbacion_salida  = np.linalg.norm(y1 - y0)
    ratio = perturbacion_salida / (perturbacion_entrada + 1e-12)
    print(f"  ‖ΔW‖≈{perturbacion_entrada:.4f}  ‖Δy‖={perturbacion_salida:.4f}  "
          f"ratio={ratio:.3f}  (continua → ratio acotado)")
`,
    related: ["Función", "Dominio y Rango", "Derivada y Gradiente", "Función de Activación", "Convergencia de Optimizadores"],
    hasViz: true,
    vizType: "limitesContinuidad",
  },
  {
    id: 12,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Vector",
    tags: ["álgebra lineal", "espacio vectorial", "norma", "producto interno", "representación"],
    definition: "Un vector es un elemento de un espacio vectorial: una entidad que puede sumarse con otros vectores y multiplicarse por escalares respetando los axiomas del espacio vectorial. En ℝⁿ se representa como una n-tupla ordenada de números reales, interpretable geométricamente como una flecha con dirección y magnitud. En ML, los vectores son la unidad fundamental de representación: un dato, un embedding, un gradiente, un estado oculto — todo es un vector en algún espacio de características.",
    formal: {
      notation: "Sea $\\mathbf{v} \\in \\mathbb{R}^n$, $\\mathbf{v} = (v_1, v_2, \\ldots, v_n)^\\top$ con $v_i \\in \\mathbb{R}$",
      body: "\\textbf{Operaciones elementales:} \\\\ \\quad \\mathbf{u} + \\mathbf{v} = (u_1+v_1,\\, \\ldots,\\, u_n+v_n)^\\top \\\\ \\quad \\alpha\\mathbf{v} = (\\alpha v_1,\\, \\ldots,\\, \\alpha v_n)^\\top, \\quad \\alpha \\in \\mathbb{R} \\\\ \\textbf{Producto interior canónico:} \\\\ \\quad \\langle \\mathbf{u}, \\mathbf{v} \\rangle = \\mathbf{u}^\\top\\mathbf{v} = \\sum_{i=1}^n u_i v_i = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta \\\\ \\textbf{Norma euclídea:} \\\\ \\quad \\|\\mathbf{v}\\|_2 = \\sqrt{\\mathbf{v}^\\top\\mathbf{v}} = \\sqrt{\\sum_{i=1}^n v_i^2}",
      geometric: "\\textbf{Normas } L^p\\text{:} \\quad \\|\\mathbf{v}\\|_p = \\left(\\sum_{i=1}^n |v_i|^p\\right)^{1/p}, \\quad p \\geq 1 \\\\ \\|\\mathbf{v}\\|_1 = \\sum|v_i| \\quad \\|\\mathbf{v}\\|_2 = \\sqrt{\\sum v_i^2} \\quad \\|\\mathbf{v}\\|_\\infty = \\max_i|v_i| \\\\ \\textbf{Proyección ortogonal: } \\operatorname{proj}_{\\mathbf{u}}\\mathbf{v} = \\frac{\\langle\\mathbf{v},\\mathbf{u}\\rangle}{\\|\\mathbf{u}\\|^2}\\,\\mathbf{u}",
      properties: [
        "\\text{Cauchy-Schwarz: } |\\langle\\mathbf{u},\\mathbf{v}\\rangle| \\leq \\|\\mathbf{u}\\|\\|\\mathbf{v}\\| \\quad (\\text{igualdad} \\iff \\mathbf{u} \\parallel \\mathbf{v})",
        "\\text{Desigualdad triangular: } \\|\\mathbf{u}+\\mathbf{v}\\| \\leq \\|\\mathbf{u}\\| + \\|\\mathbf{v}\\|",
        "\\text{Identidad de paralelogramo: } \\|\\mathbf{u}+\\mathbf{v}\\|^2 + \\|\\mathbf{u}-\\mathbf{v}\\|^2 = 2(\\|\\mathbf{u}\\|^2+\\|\\mathbf{v}\\|^2)",
      ],
    },
    intuition: "Un vector en $\\mathbb{R}^n$ tiene dos vidas simultáneas: como **flecha** (dirección + magnitud en el espacio) y como **lista de coordenadas** (representación numérica). La primera vida da intuición geométrica: el producto interior mide cuánto apuntan en la misma dirección dos flechas — si es cero, son perpendiculares; si es máximo (positivo), son paralelas. La segunda vida es la que usa el ordenador. En ML, un embedding de 768 dimensiones es una flecha en $\\mathbb{R}^{768}$: vectores similares apuntan en direcciones parecidas, y la similitud coseno mide exactamente ese ángulo entre flechas.",
    development: [
      {
        label: "Geometría del producto interior: ángulo, ortogonalidad y proyección",
        body: "El producto interior $\\langle\\mathbf{u},\\mathbf{v}\\rangle = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$ codifica simultáneamente tres informaciones: las magnitudes de ambos vectores y el coseno del ángulo entre ellos. Esto implica:\n\n- **Ortogonalidad**: $\\mathbf{u} \\perp \\mathbf{v} \\iff \\langle\\mathbf{u},\\mathbf{v}\\rangle = 0$. En embeddings, dos tokens ortogonales son 'semánticamente independientes'.\n- **Similitud coseno**: $\\cos\\theta = \\langle\\hat{\\mathbf{u}},\\hat{\\mathbf{v}}\\rangle$ donde $\\hat{\\mathbf{v}} = \\mathbf{v}/\\|\\mathbf{v}\\|$. Es la métrica estándar en búsqueda vectorial y RAG.\n- **Proyección**: $\\operatorname{proj}_{\\mathbf{u}}\\mathbf{v} = \\frac{\\langle\\mathbf{v},\\mathbf{u}\\rangle}{\\|\\mathbf{u}\\|^2}\\mathbf{u}$ es la sombra de $\\mathbf{v}$ sobre la recta generada por $\\mathbf{u}$. La descomposición $\\mathbf{v} = \\operatorname{proj}_{\\mathbf{u}}\\mathbf{v} + (\\mathbf{v} - \\operatorname{proj}_{\\mathbf{u}}\\mathbf{v})$ separa $\\mathbf{v}$ en componente paralela y perpendicular a $\\mathbf{u}$ — base de Gram-Schmidt y de la atención por cabeza en Transformers."
      },
      {
        label: "Normas y bolas unitarias: geometría de la regularización",
        body: "Una norma $\\|\\cdot\\|_p$ mide el 'tamaño' de un vector. La bola unitaria $\\mathcal{B}_p = \\{\\mathbf{x}: \\|\\mathbf{x}\\|_p \\leq 1\\}$ varía dramáticamente con $p$:\n\n- $p=1$ (Manhattan): rombo/diamante. Favorece vectores **sparse** (con muchos ceros).\n- $p=2$ (Euclídea): esfera perfecta. Invariante a rotaciones.\n- $p=\\infty$ (Chebyshev): hipercubo. Controla la coordenada máxima.\n\nEsta geometría es la clave de la regularización:\n$$\\mathcal{L}_{\\text{reg}}(\\theta) = \\mathcal{L}(\\theta) + \\lambda\\|\\theta\\|_p^p$$\n\n- **L2 (Ridge)** $p=2$: penaliza pesos grandes uniformemente, produce soluciones densas y pequeñas. El mínimo de $\\|\\theta\\|_2$ bajo una restricción lineal es el punto más cercano al origen sobre el hiperplano — punto sobre la esfera.\n- **L1 (Lasso)** $p=1$: las esquinas del diamante tocan los hiperplanos de nivel en los ejes coordenados → los mínimos tienden a tener coordenadas exactamente cero → **sparsity** automática.\n- **Elastic Net** $p \\in (1,2)$: combinación que balancea ambas propiedades."
      },
      {
        label: "Vectores en alta dimensión: concentración de medida",
        body: "La intuición geométrica de dimensiones bajas falla en $\\mathbb{R}^d$ con $d$ grande. Los fenómenos de **concentración de medida** dominan:\n\n**Norma de vectores aleatorios**: si $\\mathbf{v} \\sim \\mathcal{N}(\\mathbf{0}, I_d)$, entonces:\n$$\\|\\mathbf{v}\\|_2 \\approx \\sqrt{d} \\quad (\\text{concentra alrededor de }\\sqrt{d}\\text{ con varianza } \\mathcal{O}(1))$$\n\n**Ortogonalidad casi segura**: para $d$ grande, dos vectores aleatorios son casi ortogonales:\n$$\\cos\\theta = \\frac{\\langle\\mathbf{u},\\mathbf{v}\\rangle}{\\|\\mathbf{u}\\|\\|\\mathbf{v}\\|} \\approx \\mathcal{N}\\!\\left(0,\\frac{1}{d}\\right)$$\n\nEsto justifica por qué los embeddings de LLMs de dimensión $d=768$ o $d=4096$ pueden almacenar miles de conceptos 'casi ortogonales' sin interferencia — la **hipótesis de superposición** (Elhage et al. 2022).\n\n**Lema de Johnson-Lindenstrauss**: para cualquier conjunto de $n$ puntos en $\\mathbb{R}^d$, existe una proyección aleatoria a $k = \\mathcal{O}(\\log n / \\varepsilon^2)$ dimensiones que preserva todas las distancias con factor $(1\\pm\\varepsilon)$. Fundamento de métodos de reducción dimensional y LSH para búsqueda aproximada."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "El vector es la unidad atómica de representación en todo el ecosistema ML/DL:\n\n**Embeddings como vectores**. Cada token en un LLM tiene un embedding $\\mathbf{e}_t \\in \\mathbb{R}^d$. La similitud semántica se mide por similitud coseno: $\\operatorname{sim}(w_1, w_2) = \\langle\\hat{\\mathbf{e}}_1, \\hat{\\mathbf{e}}_2\\rangle$. Las relaciones analógicas de Word2Vec se explican geométricamente: $\\mathbf{e}_{\\text{rey}} - \\mathbf{e}_{\\text{hombre}} + \\mathbf{e}_{\\text{mujer}} \\approx \\mathbf{e}_{\\text{reina}}$ — aritmética vectorial.\n\n**Gradiente como vector**. El gradiente $\\nabla_\\theta \\mathcal{L} \\in \\mathbb{R}^p$ es un vector en el espacio de parámetros que apunta en la dirección de máximo crecimiento de $\\mathcal{L}$. El descenso de gradiente es un paso en la dirección opuesta: $\\theta \\leftarrow \\theta - \\eta\\nabla_\\theta\\mathcal{L}$.\n\n**Atención como producto interior escalado**. La puntuación de atención entre query $\\mathbf{q}_i$ y key $\\mathbf{k}_j$ es:\n$$a_{ij} = \\frac{\\mathbf{q}_i^\\top\\mathbf{k}_j}{\\sqrt{d_k}}$$\nEs literalmente un producto interior entre dos vectores, escalado por $\\sqrt{d_k}$ para compensar la concentración de medida en alta dimensión (sin escalar, los productos interiores crecen como $\\sqrt{d_k}$ y el softmax satura).\n\n**Búsqueda vectorial (RAG)**. En sistemas RAG, los documentos y queries se codifican como vectores en $\\mathbb{R}^d$. La recuperación es búsqueda de $k$-vecinos más cercanos por similitud coseno. Índices como FAISS explotan la concentración de medida y proyecciones aleatorias (HNSW, IVF) para hacer esta búsqueda eficiente en millones de vectores."
      },
    ],
    code: `import numpy as np
from typing import Optional

# ── 1. Operaciones vectoriales fundamentales ─────────────────────────────────
print("=== Operaciones vectoriales ===")
u = np.array([1., 2., 3.])
v = np.array([4., -1., 2.])

print(f"u = {u}")
print(f"v = {v}")
print(f"u + v        = {u + v}")
print(f"3u           = {3*u}")
print(f"u · v (dot)  = {np.dot(u, v)}")
print(f"‖u‖₂         = {np.linalg.norm(u):.6f}")
print(f"‖u‖₁         = {np.linalg.norm(u, 1):.6f}")
print(f"‖u‖∞         = {np.linalg.norm(u, np.inf):.6f}")

# ── 2. Ángulo y similitud coseno ──────────────────────────────────────────────
def cosine_sim(u: np.ndarray, v: np.ndarray) -> float:
    """cos θ = ⟨u,v⟩ / (‖u‖‖v‖)"""
    denom = np.linalg.norm(u) * np.linalg.norm(v)
    return float(np.dot(u, v) / denom) if denom > 1e-12 else 0.

def angulo_grados(u: np.ndarray, v: np.ndarray) -> float:
    return float(np.degrees(np.arccos(np.clip(cosine_sim(u,v), -1, 1))))

print("\\n=== Ángulo y similitud coseno ===")
pares = [
    ("u, v        ", u, v),
    ("u, u        ", u, u),
    ("u, -u       ", u, -u),
    ("u, perp(u)  ", u, np.array([-2.,1.,0.])),  # perpendicular a u en ℝ³ parcialmente
]
for nombre, a, b in pares:
    print(f"  {nombre}: cos={cosine_sim(a,b):+.4f}  θ={angulo_grados(a,b):7.3f}°")

# ── 3. Proyección ortogonal ───────────────────────────────────────────────────
def proyectar(v: np.ndarray, u: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Descompone v = proj_u(v) + perp_u(v)."""
    u_hat = u / (np.linalg.norm(u) + 1e-12)
    paralela  = np.dot(v, u_hat) * u_hat
    perp      = v - paralela
    return paralela, perp

print("\\n=== Proyección ortogonal ===")
proj, perp = proyectar(v, u)
print(f"proj_u(v)    = {proj.round(4)}")
print(f"perp_u(v)    = {perp.round(4)}")
print(f"Verificación: proj+perp = v  → {np.allclose(proj+perp, v)}")
print(f"Ortogonalidad: ⟨proj,perp⟩ = {np.dot(proj,perp):.2e}  (≈ 0)")

# ── 4. Normas Lp y geometría de regularización ────────────────────────────────
print("\\n=== Normas Lp ===")
w = np.array([3., -1., 0., 2., -4., 0., 1.])
for p in [1, 2, 3, np.inf]:
    norma = np.linalg.norm(w, p)
    print(f"  ‖w‖_{str(p):4s} = {norma:.4f}")

# Efecto de regularización L1 vs L2 en mínimos cuadrados
print("\\n=== Regularización: L1 (Lasso) vs L2 (Ridge) ===")
from numpy.linalg import solve

np.random.seed(42)
n, d = 20, 10
A = np.random.randn(n, d)
b = A @ np.ones(d) + 0.5 * np.random.randn(n)

def ridge(A, b, lam):
    """θ_ridge = (AᵀA + λI)⁻¹Aᵀb"""
    return np.linalg.solve(A.T@A + lam*np.eye(d), A.T@b)

def lasso_coord(A, b, lam, n_iter=1000):
    """Lasso por descenso de coordenadas (soft-thresholding)."""
    theta = np.zeros(d)
    r = b - A@theta
    for _ in range(n_iter):
        for j in range(d):
            r += A[:,j]*theta[j]            # desactiva columna j
            rho = A[:,j]@r
            theta[j] = np.sign(rho)*max(0, abs(rho)/np.sum(A[:,j]**2) - lam/np.sum(A[:,j]**2))
            r -= A[:,j]*theta[j]            # reactiva con nuevo valor
    return theta

for lam in [0.01, 0.1, 1.0]:
    th_r = ridge(A, b, lam)
    th_l = lasso_coord(A, b, lam)
    zeros_l = np.sum(np.abs(th_l) < 1e-4)
    print(f"  λ={lam:.2f}: Ridge ‖θ‖₂={np.linalg.norm(th_r):.3f}  "
          f"Lasso ‖θ‖₁={np.linalg.norm(th_l,1):.3f}  zeros_lasso={zeros_l}/{d}")

# ── 5. Concentración de medida en alta dimensión ──────────────────────────────
print("\\n=== Concentración de medida ===")
np.random.seed(0)
for d in [10, 100, 1000, 10000]:
    n_samp = 5000
    V = np.random.randn(n_samp, d)
    normas   = np.linalg.norm(V, axis=1)
    # Ángulo entre pares aleatorios
    A_mat = V / normas[:,None]
    cos_sim = (A_mat[:250] @ A_mat[250:500].T).diagonal()
    print(f"  d={d:5d}: E[‖v‖]={normas.mean():.2f} (≈√d={d**0.5:.2f})  "
          f"std[‖v‖]={normas.std():.3f}  E[cos_θ]={cos_sim.mean():.4f} (≈0)")

# ── 6. Similitud coseno y aritmética de embeddings ────────────────────────────
print("\\n=== Aritmética de embeddings (Word2Vec style) ===")
np.random.seed(7)
d_emb = 50

# Simula embeddings con estructura de analogía: rey-hombre+mujer≈reina
rey    = np.random.randn(d_emb)
hombre = 0.6*rey + 0.4*np.random.randn(d_emb)
mujer  = np.random.randn(d_emb)
reina  = rey - hombre + mujer + 0.05*np.random.randn(d_emb)  # analogía exacta + ruido

# Candidatos
vocab = {
    "rey": rey, "hombre": hombre, "mujer": mujer,
    "reina": reina,
    "ruido1": np.random.randn(d_emb),
    "ruido2": np.random.randn(d_emb),
}
query = rey - hombre + mujer   # rey − hombre + mujer
query_hat = query / np.linalg.norm(query)

ranking = sorted(
    [(nombre, cosine_sim(query_hat, v/np.linalg.norm(v))) for nombre,v in vocab.items()],
    key=lambda x: -x[1]
)
print("  'rey' − 'hombre' + 'mujer' ≈ ?")
for nombre, sim in ranking:
    print(f"    {nombre:8s}: cos={sim:+.4f}")

# ── 7. Producto interior escalado en atención ─────────────────────────────────
print("\\n=== Atención: escalado por √d_k ===")
for d_k in [8, 64, 512, 4096]:
    np.random.seed(d_k)
    q = np.random.randn(d_k)
    k = np.random.randn(d_k)
    score_raw    = np.dot(q, k)
    score_scaled = np.dot(q, k) / np.sqrt(d_k)
    print(f"  d_k={d_k:5d}: raw={score_raw:+8.2f}  "
          f"scaled={score_scaled:+6.3f}  (E[raw]≈0, std[raw]≈√d_k={d_k**0.5:.1f})")
`,
    related: ["Espacio Vectorial", "Matriz", "Producto Interno y Norma", "Embedding", "Atención (Attention)"],
    hasViz: true,
    vizType: "vector",
  },
  {
    id: 13,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Espacio y Subespacio Vectorial",
    tags: ["álgebra lineal", "subespacio", "clausura", "base", "dimensión", "representación"],
    definition: "Un espacio vectorial sobre un campo F es un conjunto V dotado de suma y multiplicación escalar que satisfacen 8 axiomas (clausura, asociatividad, conmutatividad, identidad y negativo aditivos, compatibilidad y distributividades escalar). Un subespacio vectorial S ⊆ V es un subconjunto no vacío cerrado bajo suma y multiplicación escalar, lo que equivale a: S contiene el vector cero, es cerrado bajo suma, y es cerrado bajo multiplicación escalar. Los subespacios son los objetos geométricos naturales del álgebra lineal — rectas, planos y hiperplanos que pasan por el origen — y son el lenguaje con el que se describe la estructura interna de las transformaciones lineales y los datos en ML.",
    formal: {
      notation: "Sea $(V, +, \\cdot)$ un espacio vectorial sobre $\\mathbb{F}$ y $S \\subseteq V$",
      body: "S \\text{ es subespacio de } V \\iff \\\\ \\quad (\\text{S1})\\; \\mathbf{0} \\in S \\\\ \\quad (\\text{S2})\\; \\mathbf{u}, \\mathbf{v} \\in S \\implies \\mathbf{u} + \\mathbf{v} \\in S \\quad (\\text{clausura bajo }+) \\\\ \\quad (\\text{S3})\\; \\mathbf{v} \\in S,\\; \\alpha \\in \\mathbb{F} \\implies \\alpha\\mathbf{v} \\in S \\quad (\\text{clausura bajo }\\cdot) \\\\ \\text{Equivalente compacto: } S \\text{ subespacio} \\iff \\forall\\,\\mathbf{u},\\mathbf{v}\\in S,\\;\\alpha,\\beta\\in\\mathbb{F}: \\alpha\\mathbf{u}+\\beta\\mathbf{v}\\in S \\\\ \\textbf{Suma de subespacios: } S_1 + S_2 = \\{\\mathbf{s}_1 + \\mathbf{s}_2 : \\mathbf{s}_1\\in S_1,\\,\\mathbf{s}_2\\in S_2\\} \\\\ \\textbf{Suma directa: } V = S_1 \\oplus S_2 \\iff S_1+S_2=V \\text{ y } S_1\\cap S_2=\\{\\mathbf{0}\\}",
      geometric: "\\dim(S_1 + S_2) = \\dim S_1 + \\dim S_2 - \\dim(S_1 \\cap S_2) \\quad (\\text{fórmula de Grassmann}) \\\\ \\text{Complemento ortogonal: } S^\\perp = \\{\\mathbf{v}\\in V: \\langle\\mathbf{v},\\mathbf{s}\\rangle=0\\;\\forall\\,\\mathbf{s}\\in S\\} \\\\ V = S \\oplus S^\\perp \\quad \\text{y} \\quad \\dim S + \\dim S^\\perp = \\dim V",
      properties: [
        "\\text{Intersección arbitraria de subespacios es subespacio: } \\bigcap_i S_i \\text{ subespacio}",
        "\\text{Unión de subespacios es subespacio} \\iff S_1 \\subseteq S_2 \\text{ o } S_2 \\subseteq S_1",
        "\\text{Subespacio generado: } \\operatorname{span}(A) = \\left\\{\\sum_{i} \\alpha_i \\mathbf{a}_i : \\alpha_i \\in \\mathbb{F},\\, \\mathbf{a}_i \\in A\\right\\} \\text{ — el menor subespacio que contiene a }A",
      ],
    },
    intuition: "Un subespacio es una 'versión más pequeña' del espacio original que mantiene toda la estructura: si tienes dos vectores dentro, su suma y cualquier múltiplo escalar también están dentro. Geométricamente en $\\mathbb{R}^3$, los únicos subespacios son el punto de origen $\\{\\mathbf{0}\\}$, las rectas por el origen, los planos por el origen, y el espacio entero. El requisito de que pasen por el origen es clave: una recta que no pasa por el origen es un **variedad afín** (traslado de subespacio), no un subespacio. En ML, el espacio de columnas de una matriz de pesos determina qué transformaciones puede realizar una capa lineal — es el subespacio de todas las salidas posibles.",
    development: [
      {
        label: "Subespacios fundamentales de una matriz: los cuatro de Strang",
        body: "Dada $A \\in \\mathbb{R}^{m \\times n}$ de rango $r$, hay cuatro subespacios fundamentales que describen completamente la acción de $A$:\n\n| Subespacio | Definición | Dimensión | Espacio |\n|---|---|---|---|\n| Espacio columna $\\mathcal{C}(A)$ | $\\{A\\mathbf{x}: \\mathbf{x}\\in\\mathbb{R}^n\\}$ | $r$ | $\\mathbb{R}^m$ |\n| Espacio nulo $\\mathcal{N}(A)$ | $\\{\\mathbf{x}: A\\mathbf{x}=\\mathbf{0}\\}$ | $n-r$ | $\\mathbb{R}^n$ |\n| Espacio fila $\\mathcal{C}(A^\\top)$ | $\\{A^\\top\\mathbf{y}: \\mathbf{y}\\in\\mathbb{R}^m\\}$ | $r$ | $\\mathbb{R}^n$ |\n| Espacio nulo izq. $\\mathcal{N}(A^\\top)$ | $\\{\\mathbf{y}: A^\\top\\mathbf{y}=\\mathbf{0}\\}$ | $m-r$ | $\\mathbb{R}^m$ |\n\nLa **ortogonalidad fundamental**: $\\mathcal{C}(A)^\\perp = \\mathcal{N}(A^\\top)$ y $\\mathcal{C}(A^\\top)^\\perp = \\mathcal{N}(A)$. Toda entrada $\\mathbf{x}$ se descompone ortogonalmente como $\\mathbf{x} = \\mathbf{x}_r + \\mathbf{x}_n$ con $\\mathbf{x}_r \\in \\mathcal{C}(A^\\top)$ y $\\mathbf{x}_n \\in \\mathcal{N}(A)$. Sólo $\\mathbf{x}_r$ sobrevive a la multiplicación por $A$."
      },
      {
        label: "Base, dimensión y cambio de coordenadas",
        body: "Un conjunto $\\mathcal{B} = \\{\\mathbf{b}_1, \\ldots, \\mathbf{b}_k\\}$ es **base** de un subespacio $S$ si es linealmente independiente (L.I.) y $\\operatorname{span}(\\mathcal{B}) = S$. La **dimensión** $\\dim(S) = k$ es el número de vectores en cualquier base.\n\nEl **Teorema de la Base** garantiza que toda base de $S$ tiene el mismo número de elementos. Las coordenadas $[\\mathbf{v}]_{\\mathcal{B}}$ de $\\mathbf{v}$ respecto a $\\mathcal{B}$ son los únicos $\\alpha_i$ tales que $\\mathbf{v} = \\sum_i \\alpha_i \\mathbf{b}_i$.\n\nEl **cambio de base** entre $\\mathcal{B}$ y $\\mathcal{C}$ se realiza mediante la matriz de transición $P_{\\mathcal{B} \\to \\mathcal{C}} \\in \\mathbb{R}^{k\\times k}$:\n$$[\\mathbf{v}]_{\\mathcal{C}} = P_{\\mathcal{B}\\to\\mathcal{C}}\\,[\\mathbf{v}]_{\\mathcal{B}}$$\n\nEn ML, cada capa de una red realiza implícitamente un cambio de base: transforma las representaciones de la base de entrada a la base de características aprendidas en la capa siguiente. El embedding de un token es precisamente sus coordenadas en el subespacio semántico aprendido."
      },
      {
        label: "Complemento ortogonal, proyecciones y descomposición espectral",
        body: "Para $S \\subseteq \\mathbb{R}^n$ subespacio, su **complemento ortogonal** $S^\\perp = \\{\\mathbf{v}: \\langle\\mathbf{v},\\mathbf{s}\\rangle = 0\\;\\forall\\mathbf{s}\\in S\\}$ cumple $\\mathbb{R}^n = S \\oplus S^\\perp$. La **proyección ortogonal** sobre $S$ es la única transformación lineal $P_S: \\mathbb{R}^n \\to S$ tal que:\n$$P_S^2 = P_S \\quad (\\text{idempotente}) \\qquad P_S = P_S^\\top \\quad (\\text{simétrica})$$\n\nSi $\\{\\mathbf{q}_1,\\ldots,\\mathbf{q}_r\\}$ es base ortonormal de $S$ y $Q=[\\mathbf{q}_1|\\cdots|\\mathbf{q}_r]$:\n$$P_S = QQ^\\top \\in \\mathbb{R}^{n\\times n}$$\n\nLa **descomposición espectral** de una matriz simétrica $A = Q\\Lambda Q^\\top$ expresa $A$ como suma de proyecciones sobre sus autoespacios:\n$$A = \\sum_{i=1}^n \\lambda_i \\mathbf{q}_i\\mathbf{q}_i^\\top$$\n\ncada $\\mathbf{q}_i\\mathbf{q}_i^\\top$ es la proyección sobre el subespacio generado por el $i$-ésimo autovector — fundamental en PCA, análisis espectral y Graph Neural Networks."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "Los subespacios estructuran la geometría de la representación en ML a múltiples niveles:\n\n**Espacio columna de capas lineales.** La capa $f(\\mathbf{x}) = W\\mathbf{x}$ con $W \\in \\mathbb{R}^{m\\times n}$ y $\\operatorname{rank}(W)=r<\\min(m,n)$ mapea toda entrada al subespacio $\\mathcal{C}(W) \\subsetneq \\mathbb{R}^m$ de dimensión $r$. Esto es el **cuello de botella informacional**: independientemente de la entrada, la salida vive en un subespacio de dimensión $r$. El diseño de arquitecturas bottleneck (autoencoders, cross-attention en Transformers) explota esto deliberadamente.\n\n**Rango intrínseco y LoRA.** Los pesos de LLMs preentrenados tienen rango efectivo mucho menor que su tamaño total. LoRA (Low-Rank Adaptation) explota esto: en lugar de ajustar $W \\in \\mathbb{R}^{m\\times n}$, aprende $\\Delta W = BA$ con $B \\in \\mathbb{R}^{m\\times r}$, $A \\in \\mathbb{R}^{r\\times n}$, $r \\ll \\min(m,n)$. El espacio de fine-tuning está restringido a un subespacio de rango $r$ del espacio de pesos — reduciendo parámetros entrenables de millones a miles.\n\n**Subespacio nulo y degeneración.** Si $\\mathcal{N}(W) \\neq \\{\\mathbf{0}\\}$, hay entradas no nulas que producen salida cero — pérdida de información irrecuperable. Capas con $\\operatorname{rank}(W) < n$ hacen que la red sea insensible a ciertas direcciones del espacio de entrada. Esto puede ser un bug (expresividad limitada) o una feature (invarianzas aprendidas, como en redes equivariantes).\n\n**Cabezas de atención y subespacios.**  Cada cabeza de atención en un Transformer opera en un subespacio de dimensión $d_k = d_{\\text{model}}/h$:\n$$Q_i = XW_i^Q, \\quad K_i = XW_i^K, \\quad V_i = XW_i^V$$\n\nLas matrices $W_i^Q, W_i^K, W_i^V \\in \\mathbb{R}^{d_{\\text{model}}\\times d_k}$ proyectan la representación al subespacio de la cabeza $i$. La interpretabilidad mecanística estudia qué subespacio semántico 'atiende' cada cabeza."
      },
    ],
    code: `import numpy as np
from typing import Optional

# ── 1. Verificación de subespacio ────────────────────────────────────────────
def es_subespacio(
    candidatos: np.ndarray,           # filas = vectores que generan el candidato
    espacio_dim: int,
    n_tests: int = 2000,
    tol: float = 1e-8,
) -> dict:
    """
    Verifica los 3 axiomas de subespacio para span(candidatos) ⊆ ℝ^{espacio_dim}.
    Genera combinaciones lineales aleatorias y comprueba clausura.
    """
    rng = np.random.default_rng(42)

    def en_subespacio(v):
        """Proyecta v sobre span(candidatos) y mide residuo."""
        Q, _ = np.linalg.qr(candidatos.T)
        proj = Q @ Q.T @ v
        return np.linalg.norm(v - proj) < tol

    resultados = {"contiene_cero": en_subespacio(np.zeros(espacio_dim))}

    falla_suma = falla_escalar = 0
    for _ in range(n_tests):
        # Genera vectores dentro del subespacio
        alphas = rng.standard_normal(len(candidatos))
        betas  = rng.standard_normal(len(candidatos))
        u = candidatos.T @ alphas
        v = candidatos.T @ betas
        alpha = rng.standard_normal()

        if not en_subespacio(u + v):   falla_suma    += 1
        if not en_subespacio(alpha*u): falla_escalar += 1

    resultados.update({
        "clausura_suma":    falla_suma == 0,
        "clausura_escalar": falla_escalar == 0,
        "es_subespacio":    resultados["contiene_cero"] and
                            falla_suma == 0 and falla_escalar == 0,
    })
    return resultados

print("=== Verificación de subespacios en ℝ³ ===")
# Plano x+y+z=0: vectores que lo generan
plano_vecs = np.array([[1., -1., 0.], [0., 1., -1.]])
# Recta en dirección (1,2,3)
recta_vecs = np.array([[1., 2., 3.]])
# "Candidato" inválido: plano x+y+z=1 (no pasa por origen)
# No podemos representarlo como span, pero sí verificar que (1,0,0)+(0,1,0)=(1,1,0)
# no está en {(x,y,z):x+y+z=1} → suma falla.

for nombre, vecs in [
    ("Plano x+y+z=0  (subespacio)", plano_vecs),
    ("Recta t·(1,2,3) (subespacio)", recta_vecs),
    ("Solo {(2,0,0)}  (no subespacio)", np.array([[2., 0., 0.]])),
]:
    res = es_subespacio(vecs, espacio_dim=3)
    print(f"  {nombre}: {res}")

# ── 2. Los cuatro subespacios fundamentales de una matriz ─────────────────────
print("\\n=== Cuatro subespacios de Strang ===")
A = np.array([[1., 2., 3.],
              [4., 5., 6.],
              [7., 8., 9.]])     # rango 2 (filas/cols linealmente dependientes)

def cuatro_subespacios(A: np.ndarray) -> dict:
    m, n = A.shape
    # SVD: A = U Σ Vᵀ
    U, s, Vt = np.linalg.svd(A, full_matrices=True)
    r = int(np.sum(s > 1e-9))

    return {
        "rango r":          r,
        "C(A)  dim=r":      U[:, :r],             # primeras r cols de U
        "N(Aᵀ) dim=m-r":   U[:, r:],             # últimas m-r cols de U
        "C(Aᵀ) dim=r":     Vt[:r, :].T,          # primeras r filas de Vt (transpuestas)
        "N(A)  dim=n-r":   Vt[r:, :].T,          # últimas n-r filas de Vt
    }

ss = cuatro_subespacios(A)
print(f"  A ∈ ℝ^{{{A.shape[0]}×{A.shape[1]}}},  rango = {ss['rango r']}")
for nombre, base in ss.items():
    if nombre == "rango r": continue
    if hasattr(base, 'shape'):
        print(f"  {nombre}: base de forma {base.shape}")
        print(f"    {base.round(4)}")

# Verificación ortogonalidad fundamental
CA  = ss["C(A)  dim=r"]
NAt = ss["N(Aᵀ) dim=m-r"]
print(f"  C(A) ⊥ N(Aᵀ): max|⟨c,n⟩| = {np.abs(CA.T @ NAt).max():.2e}  (≈ 0)")

# ── 3. Proyección ortogonal sobre un subespacio ────────────────────────────────
print("\\n=== Proyección ortogonal P = QQᵀ ===")
def proyeccion_ortogonal(S_base: np.ndarray) -> np.ndarray:
    """P = QQᵀ donde Q es base ortonormal de span(S_base)."""
    Q, _ = np.linalg.qr(S_base)
    r = S_base.shape[1]
    return Q[:, :r] @ Q[:, :r].T

# Subespacio: plano x+y+z=0 en ℝ³
S = plano_vecs.T                        # columnas = generadores
P = proyeccion_ortogonal(S)
print(f"  P =\\n{P.round(4)}")
print(f"  P² = P (idempotente): {np.allclose(P@P, P)}")
print(f"  P = Pᵀ (simétrica):   {np.allclose(P, P.T)}")

# Proyectar vector
v_test = np.array([1., 1., 1.])
v_proj = P @ v_test
v_perp = v_test - v_proj
print(f"  v = {v_test}")
print(f"  proj_S(v) = {v_proj.round(4)}")
print(f"  perp_S(v) = {v_perp.round(4)}")
print(f"  ⟨proj, perp⟩ = {np.dot(v_proj, v_perp):.2e}  (≈ 0)")

# ── 4. LoRA: fine-tuning en subespacio de bajo rango ─────────────────────────
print("\\n=== LoRA: actualización de bajo rango ===")
np.random.seed(42)
d_model, d_ff = 512, 2048         # dimensiones típicas de FFN en Transformer
r_lora        = 8                  # rango de la adaptación

W_pretrain = np.random.randn(d_ff, d_model) * 0.01   # pesos preentrenados (fijos)

# LoRA: ΔW = B @ A,   B ∈ ℝ^{d_ff×r},  A ∈ ℝ^{r×d_model}
A_lora = np.random.randn(r_lora, d_model) * 0.01
B_lora = np.zeros((d_ff, r_lora))              # B inicializa en 0 → ΔW=0 al inicio

W_lora = W_pretrain + B_lora @ A_lora          # pesos efectivos

params_full = d_ff * d_model
params_lora = r_lora * (d_ff + d_model)
print(f"  W ∈ ℝ^{{{d_ff}×{d_model}}}   parámetros totales: {params_full:,}")
print(f"  LoRA rango r={r_lora}:        parámetros entrenables: {params_lora:,}")
print(f"  Reducción: ×{params_full/params_lora:.1f}  ({100*params_lora/params_full:.2f}%)")
print(f"  rank(ΔW) = rank(BA) ≤ r = {r_lora}  ← actualización en subespacio de dim {r_lora}")

# ── 5. Cabezas de atención como proyecciones a subespacios ────────────────────
print("\\n=== Multi-Head Attention: subespacios por cabeza ===")
d_model_att, h = 256, 8
d_k = d_model_att // h

np.random.seed(1)
# Proyecciones por cabeza (simuladas)
WQ = [np.random.randn(d_model_att, d_k) * np.sqrt(2/d_model_att) for _ in range(h)]
WK = [np.random.randn(d_model_att, d_k) * np.sqrt(2/d_model_att) for _ in range(h)]

x = np.random.randn(d_model_att)          # embedding de un token

print(f"  d_model={d_model_att}, h={h}, d_k={d_k}")
for i in range(h):
    q_i = WQ[i].T @ x
    k_i = WK[i].T @ x
    score = np.dot(q_i, k_i) / np.sqrt(d_k)
    print(f"  Cabeza {i}: ‖q_i‖={np.linalg.norm(q_i):.3f}  score=q·k/√d={score:.3f}")

# Dimensión del subespacio efectivo de las cabezas (rango de la proyección)
for i in [0, 3, 7]:
    r_i = np.linalg.matrix_rank(WQ[i], tol=1e-8)
    print(f"  rank(W_Q[{i}]) = {r_i}  → cada cabeza opera en subespacio de dim ≤ {r_i}")
`,
    related: ["Vector", "Transformación Lineal", "Matriz", "PCA y SVD", "LoRA"],
    hasViz: true,
    vizType: "espacioSubespacio",
  },
  {
    id: 14,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Combinación Lineal y Span",
    tags: ["álgebra lineal", "span", "generadores", "independencia lineal", "base", "representación"],
    definition: "Una combinación lineal de vectores {v₁,…,vₖ} es cualquier vector de la forma α₁v₁+⋯+αₖvₖ con escalares αᵢ ∈ F. El span (o espacio generado) de un conjunto A es el conjunto de todas las combinaciones lineales posibles de sus elementos, y es el menor subespacio vectorial que contiene a A. El span captura la idea de qué vectores pueden 'construirse' a partir de un conjunto dado — si un vector b está en span({v₁,…,vₖ}), el sistema Ax=b tiene solución; si no lo está, no la tiene.",
    formal: {
      notation: "Sean $\\mathbf{v}_1, \\ldots, \\mathbf{v}_k \\in V$ y $\\alpha_1, \\ldots, \\alpha_k \\in \\mathbb{F}$",
      body: "\\text{Combinación lineal: } \\mathbf{w} = \\sum_{i=1}^k \\alpha_i \\mathbf{v}_i = \\alpha_1\\mathbf{v}_1 + \\cdots + \\alpha_k\\mathbf{v}_k \\\\ \\text{Span: } \\operatorname{span}(\\mathbf{v}_1,\\ldots,\\mathbf{v}_k) = \\left\\{\\sum_{i=1}^k \\alpha_i\\mathbf{v}_i : \\alpha_i \\in \\mathbb{F}\\right\\} \\\\ \\text{Consistencia de } A\\mathbf{x}=\\mathbf{b}: \\quad \\mathbf{b} \\in \\operatorname{span}(\\mathbf{a}_1,\\ldots,\\mathbf{a}_n) \\iff \\mathbf{b} \\in \\mathcal{C}(A) \\\\ \\text{Sobreyectividad: } \\mathcal{C}(A) = \\mathbb{R}^m \\iff \\operatorname{rank}(A)=m \\iff A\\mathbf{x}=\\mathbf{b} \\text{ siempre consistente}",
      geometric: "\\operatorname{span}(\\{\\mathbf{v}\\}) = \\text{recta por el origen en dirección } \\mathbf{v} \\\\ \\operatorname{span}(\\{\\mathbf{v}_1,\\mathbf{v}_2\\}) = \\begin{cases} \\text{plano por el origen} & \\mathbf{v}_1 \\not\\parallel \\mathbf{v}_2 \\\\ \\text{recta} & \\mathbf{v}_1 \\parallel \\mathbf{v}_2 \\end{cases} \\\\ \\dim\\operatorname{span}(\\mathbf{v}_1,\\ldots,\\mathbf{v}_k) = \\operatorname{rank}([\\mathbf{v}_1|\\cdots|\\mathbf{v}_k])",
      properties: [
        "\\operatorname{span}(A) \\text{ es el menor subespacio que contiene a } A: \\; S \\supseteq A \\Rightarrow S \\supseteq \\operatorname{span}(A)",
        "\\operatorname{span}(A) = \\operatorname{span}(B) \\iff \\text{cada vector de }A\\text{ es comb. lineal de }B\\text{ y viceversa}",
        "\\mathbf{v} \\in \\operatorname{span}(A) \\iff \\operatorname{span}(A \\cup \\{\\mathbf{v}\\}) = \\operatorname{span}(A) \\quad (\\text{criterio de dependencia lineal})",
      ],
    },
    intuition: "El span es el 'alcance' de un conjunto de vectores: todas las posibles mezclas que puedes hacer combinando los vectores con cualquier receta de escalares. Si tienes dos vectores no paralelos en $\\mathbb{R}^2$, su span es todo el plano — con mezclas adecuadas de ambos puedes llegar a cualquier punto. Si son paralelos, solo alcanzas una recta. En ML, las columnas de una matriz de embeddings generan el espacio semántico accesible al modelo: si el span de los embeddings de entrada no cubre ciertas direcciones del espacio de salida, el modelo no puede expresar ciertos conceptos, sin importar qué escalares (pesos de atención) use.",
    development: [
      {
        label: "Span y consistencia de sistemas lineales",
        body: "El sistema $A\\mathbf{x} = \\mathbf{b}$ con $A = [\\mathbf{a}_1|\\cdots|\\mathbf{a}_n] \\in \\mathbb{R}^{m\\times n}$ equivale a preguntarse si $\\mathbf{b}$ es una combinación lineal de las columnas de $A$:\n$$A\\mathbf{x} = x_1\\mathbf{a}_1 + x_2\\mathbf{a}_2 + \\cdots + x_n\\mathbf{a}_n = \\mathbf{b}$$\n\nSi $\\mathbf{b} \\in \\mathcal{C}(A) = \\operatorname{span}(\\mathbf{a}_1,\\ldots,\\mathbf{a}_n)$, el sistema es **consistente** y $\\mathbf{x}$ son los coeficientes de la combinación. Si $\\mathbf{b} \\notin \\mathcal{C}(A)$, no hay solución exacta — solo la **solución de mínimos cuadrados** $\\hat{\\mathbf{x}} = A^+\\mathbf{b}$, que proyecta $\\mathbf{b}$ sobre $\\mathcal{C}(A)$.\n\nEl criterio de consistencia via rango aumentado:\n$$A\\mathbf{x}=\\mathbf{b} \\text{ consistente} \\iff \\operatorname{rank}([A|\\mathbf{b}]) = \\operatorname{rank}(A)$$"
      },
      {
        label: "Independencia lineal: cuando el span es máximo sin redundancia",
        body: "Un conjunto $\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\}$ es **linealmente independiente** (L.I.) si la única combinación lineal que produce el cero es la trivial:\n$$\\sum_{i=1}^k \\alpha_i \\mathbf{v}_i = \\mathbf{0} \\implies \\alpha_1=\\cdots=\\alpha_k=0$$\n\nSi el conjunto es L.I., ningún vector del conjunto está en el span de los demás — cada uno aporta una dirección genuinamente nueva. Si es **linealmente dependiente**, al menos un vector es redundante (combinación de los otros) y puede eliminarse sin reducir el span.\n\nLa dimensión del span se calcula directamente:\n$$\\dim\\operatorname{span}(\\mathbf{v}_1,\\ldots,\\mathbf{v}_k) = \\operatorname{rank}([\\mathbf{v}_1|\\cdots|\\mathbf{v}_k])$$\n\nEn particular, $k$ vectores en $\\mathbb{R}^n$ con $k > n$ son **siempre** linealmente dependientes (por el Teorema de la Dimensión)."
      },
      {
        label: "Span como espacio de soluciones y de hipótesis",
        body: "El span tiene dos interpretaciones duales en álgebra lineal:\n\n**Como espacio de alcance (imagen)**: $\\mathcal{C}(A) = \\operatorname{span}(\\text{cols de }A)$ es el conjunto de vectores $\\mathbf{b}$ para los que $A\\mathbf{x}=\\mathbf{b}$ es resoluble. Define qué funciones $\\mathbf{b}$ puede 'aprender' un modelo lineal.\n\n**Como espacio de representación**: dado un conjunto de funciones base $\\{\\phi_1,\\ldots,\\phi_k\\}$, el span $\\{\\sum_i w_i\\phi_i: w_i\\in\\mathbb{R}\\}$ es la **clase de hipótesis** de modelos lineales en esas bases. Los polinomios de grado $\\leq d$, las funciones de la base de Fourier truncada, y las representaciones de kernel son todos spans de funciones base específicas.\n\nLa elección de las funciones base $\\{\\phi_i\\}$ determina **qué puede aprender** el modelo, independientemente de los pesos $\\mathbf{w}$. Las redes neuronales aprenden las propias funciones base $\\phi_i$ (columnas de la última capa) de manera adaptativa — en contraste con los modelos lineales donde las $\\phi_i$ son fijas."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "Las combinaciones lineales y el span aparecen como operación fundamental en casi todos los módulos de una red neuronal:\n\n**Capa densa = combinación lineal de filas de activación.**  La salida $\\mathbf{h} = W\\mathbf{x} + \\mathbf{b}$ es un vector cuya coordenada $j$-ésima es $h_j = \\mathbf{w}_j^\\top\\mathbf{x} + b_j$ — combinación lineal de los componentes de $\\mathbf{x}$ con pesos $\\mathbf{w}_j$. El vector $\\mathbf{h}$ vive en $\\operatorname{span}(\\text{filas de }W) + \\mathbf{b}$ (variedad afín).\n\n**Atención como combinación lineal de valores.**  El mecanismo de atención produce:\n$$\\mathbf{o}_i = \\sum_{j=1}^n \\alpha_{ij}\\mathbf{v}_j = \\text{combinación lineal de valores}$$\ndonde los pesos $\\alpha_{ij} = \\operatorname{softmax}(\\mathbf{q}_i^\\top K^\\top/\\sqrt{d_k})_j \\geq 0$ suman 1. La salida de la atención es siempre una **combinación convexa** de los valores $\\{\\mathbf{v}_j\\}$, por tanto vive en su envolvente convexa — subconjunto del span.\n\n**Colapso de rango y degeneración.**  Si las columnas de $W$ son casi linealmente dependientes ($\\operatorname{rank}(W) \\ll d_{\\text{out}}$), la capa proyecta entradas a un subespacio de baja dimensión — pérdida de capacidad representacional. El **colapso de representaciones** en auto-supervisado ocurre cuando los embeddings colapsan a un span de dimensión 1 (todos los vectores se vuelven proporcionales). Métodos como SimCLR, BYOL y VICReg añaden penalizaciones para mantener el span de representaciones expandido.\n\n**Mezcla de expertos (MoE) como combinación lineal de expertos.**  La salida de un módulo MoE es una combinación lineal ponderada de $K$ expertos:\n$$\\mathbf{y} = \\sum_{k=1}^K g_k(\\mathbf{x})\\, E_k(\\mathbf{x}), \\quad g_k \\geq 0, \\sum_k g_k=1$$\nEl enrutador $g_k(\\mathbf{x})$ produce los coeficientes de la combinación convexa de los outputs de los expertos — span adaptativo a la entrada."
      },
    ],
    code: `import numpy as np
from typing import Optional

# ── 1. Pertenencia al span: ¿b ∈ span(v₁,...,vₖ)? ────────────────────────────
def en_span(b: np.ndarray, *vectores: np.ndarray, tol: float = 1e-8) -> dict:
    """
    Determina si b ∈ span(vectores) resolviendo el sistema Ax = b
    donde A = [v₁|...|vₖ] via mínimos cuadrados.
    """
    A = np.column_stack(vectores)                 # A ∈ ℝ^{m×k}
    # Solución de mínimos cuadrados: x̂ = argmin ‖Ax-b‖
    x_hat, residuals, rank, sv = np.linalg.lstsq(A, b, rcond=None)
    residuo = float(np.linalg.norm(A @ x_hat - b))
    return {
        "en_span":   residuo < tol,
        "residuo":   residuo,
        "coefs":     x_hat,                       # coeficientes de la comb. lineal
        "rank_A":    rank,
        "verificacion": A @ x_hat,               # reconstrucción b̂
    }

print("=== Pertenencia al span ===")
v1 = np.array([1., 0., 0.])
v2 = np.array([0., 1., 0.])

casos = [
    ("b=(2,3,0)  ← span",  np.array([2., 3., 0.])),
    ("b=(0,0,1)  ← no span", np.array([0., 0., 1.])),
    ("b=(1,1,1)  ← no span", np.array([1., 1., 1.])),
    ("b=(-2,5,0) ← span",  np.array([-2., 5., 0.])),
]
for nombre, b in casos:
    res = en_span(b, v1, v2)
    sim = "✓" if res["en_span"] else "✗"
    print(f"  {sim} {nombre}: coefs={res['coefs'].round(3)}  residuo={res['residuo']:.2e}")

# ── 2. Dimensión del span: rank de la matriz de columnas ──────────────────────
print("\\n=== Dimensión del span ===")
conjuntos = [
    ("3 vectores L.I. en ℝ³",
     [np.array([1.,0.,0.]), np.array([0.,1.,0.]), np.array([0.,0.,1.])]),
    ("2 vectores en ℝ³ (plano)",
     [np.array([1.,2.,3.]), np.array([4.,5.,6.])]),
    ("3 vectores dep. (1 redund.)",
     [np.array([1.,2.,0.]), np.array([2.,4.,0.]), np.array([0.,1.,1.])]),
    ("4 vectores en ℝ³ (max dim=3)",
     [np.array([1.,0.,0.]),np.array([0.,1.,0.]),np.array([0.,0.,1.]),np.array([1.,1.,1.])]),
]
for nombre, vecs in conjuntos:
    A = np.column_stack(vecs)
    r = np.linalg.matrix_rank(A)
    print(f"  {nombre}: k={len(vecs)} vectores → dim(span)={r}")

# ── 3. Independencia lineal via eliminación gaussiana ─────────────────────────
def independencia_lineal(vectores: list[np.ndarray], tol: float = 1e-8) -> dict:
    """
    Determina L.I. y extrae subconjunto máximo L.I. (base del span).
    """
    A = np.column_stack(vectores).T          # filas = vectores
    m, n = A.shape
    # Reducción por filas con pivoteo
    A_red = A.copy().astype(float)
    pivots = []
    row = 0
    for col in range(n):
        # Buscar pivote
        max_row = row + np.argmax(np.abs(A_red[row:, col]))
        if np.abs(A_red[max_row, col]) < tol:
            continue
        A_red[[row, max_row]] = A_red[[max_row, row]]
        A_red[row] /= A_red[row, col]
        for i in range(m):
            if i != row:
                A_red[i] -= A_red[i, col] * A_red[row]
        pivots.append(row)
        row += 1
        if row >= m: break
    rango = len(pivots)
    return {
        "linealmente_independientes": rango == len(vectores),
        "rango": rango,
        "vectores_base": [vectores[i] for i in pivots],  # subconjunto L.I.
        "vectores_redundantes": len(vectores) - rango,
    }

print("\\n=== Independencia lineal ===")
tests = [
    ("L.I.: (1,0),(0,1)",           [np.array([1.,0.]),np.array([0.,1.])]),
    ("Dep: (1,2),(2,4)",            [np.array([1.,2.]),np.array([2.,4.])]),
    ("L.I.: (1,0,0),(0,1,0),(0,0,1)",[np.array([1.,0.,0.]),np.array([0.,1.,0.]),np.array([0.,0.,1.])]),
    ("Dep: 3 vecs en ℝ² (k>n)",    [np.array([1.,0.]),np.array([0.,1.]),np.array([1.,1.])]),
]
for nombre, vecs in tests:
    res = independencia_lineal(vecs)
    print(f"  {nombre}")
    print(f"    LI={res['linealmente_independientes']}  rango={res['rango']}  "
          f"redundantes={res['vectores_redundantes']}")

# ── 4. Atención como combinación convexa de valores ───────────────────────────
print("\\n=== Atención: combinación lineal convexa de valores ===")
np.random.seed(42)
d_k, d_v, n_tokens = 8, 16, 6

Q = np.random.randn(1, d_k)          # query (1 token)
K = np.random.randn(n_tokens, d_k)   # keys
V = np.random.randn(n_tokens, d_v)   # values

scores = Q @ K.T / np.sqrt(d_k)      # (1, n_tokens)

def softmax(x):
    e = np.exp(x - x.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

alpha = softmax(scores)               # pesos de atención (1, n_tokens)
output = alpha @ V                    # (1, d_v) — combinación lineal de valores

print(f"  Pesos α (suman 1): {alpha.round(3)}")
print(f"  Σα = {alpha.sum():.6f}")
print(f"  output ∈ ℝ^{{{d_v}}}: {output.round(3)}")

# Verificar que output ∈ span(V)
res_span = en_span(output.squeeze(), *[V[i] for i in range(n_tokens)])
print(f"  output ∈ span(V): {res_span['en_span']}  residuo={res_span['residuo']:.2e}")

# ── 5. Colapso de span: detección vía valores singulares ─────────────────────
print("\\n=== Colapso de representaciones (span degenerado) ===")
np.random.seed(0)
n_emb, d_emb = 64, 32

def rango_efectivo(E: np.ndarray, umbral: float = 0.99) -> int:
    """
    Rango efectivo: mínimo k tal que los k primeros valores
    singulares acumulan 'umbral' fracción de la energía total.
    """
    _, s, _ = np.linalg.svd(E, full_matrices=False)
    energia = np.cumsum(s**2) / np.sum(s**2)
    return int(np.searchsorted(energia, umbral)) + 1

for nombre, E in [
    ("Random (sin colapso)",       np.random.randn(n_emb, d_emb)),
    ("Colapso parcial (rank≈8)",   np.random.randn(n_emb, 8) @ np.random.randn(8, d_emb)),
    ("Colapso total (todos=const)", np.ones((n_emb, d_emb)) + 0.01*np.random.randn(n_emb,d_emb)),
]:
    r_ef = rango_efectivo(E)
    _, sv, _ = np.linalg.svd(E, full_matrices=False)
    print(f"  {nombre:35s}: rank_eff(99%)={r_ef:3d}  "
          f"σ₁={sv[0]:.2f}  σ₃₂={sv[-1]:.4f}  ratio={sv[0]/sv[-1]:.1f}")

# ── 6. MoE: combinación lineal de expertos ────────────────────────────────────
print("\\n=== MoE: combinación lineal ponderada de expertos ===")
np.random.seed(7)
K_exp, d_in2, d_out2 = 4, 8, 8

# Expertos: redes lineales simples E_k(x) = W_k x
experts = [np.random.randn(d_out2, d_in2)*0.5 for _ in range(K_exp)]
x_in = np.random.randn(d_in2)

# Router: softmax(Wx)
W_router = np.random.randn(K_exp, d_in2)*0.5
logits   = W_router @ x_in
gates    = softmax(logits.reshape(1,-1)).squeeze()    # pesos convexos

# Salida MoE = Σ gates_k * E_k(x)
outputs_exp = np.stack([E @ x_in for E in experts])  # (K, d_out)
moe_output  = gates @ outputs_exp                     # comb. lineal convexa

print(f"  Gates (Σ=1): {gates.round(3)}")
for k in range(K_exp):
    print(f"  E_{k}(x) = {outputs_exp[k].round(3)}")
print(f"  MoE(x) = Σ g_k·E_k(x) = {moe_output.round(3)}")
# Verificar que está en el span de las salidas de expertos
res_moe = en_span(moe_output, *[outputs_exp[k] for k in range(K_exp)])
print(f"  MoE ∈ span({{E_k(x)}}): {res_moe['en_span']}  residuo={res_moe['residuo']:.2e}")
`,
    related: ["Espacio y Subespacio Vectorial", "Independencia Lineal y Base", "Transformación Lineal", "Mecanismo de Atención", "Colapso de Representaciones"],
    hasViz: true,
    vizType: "combinacionLinealSpan",
  },
  {
    id: 15,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Independencia Lineal",
    tags: ["álgebra lineal", "independencia lineal", "dependencia", "rango", "base", "redundancia"],
    definition: "Un conjunto de vectores {v₁,…,vₖ} en un espacio vectorial V es linealmente independiente (L.I.) si la única combinación lineal que produce el vector cero es la trivial: α₁v₁+⋯+αₖvₖ=0 implica α₁=⋯=αₖ=0. Si existe una combinación no trivial que produce el cero, el conjunto es linealmente dependiente (L.D.), lo que equivale a que al menos un vector es combinación lineal de los demás — es redundante y puede eliminarse sin reducir el span. La independencia lineal es la condición exacta que garantiza que una representación sea única y no redundante.",
    formal: {
      notation: "Sean $\\mathbf{v}_1, \\ldots, \\mathbf{v}_k \\in V$ y $\\alpha_1, \\ldots, \\alpha_k \\in \\mathbb{F}$",
      body: "\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\} \\text{ L.I.} \\iff \\left[\\sum_{i=1}^k \\alpha_i\\mathbf{v}_i = \\mathbf{0} \\implies \\alpha_1=\\cdots=\\alpha_k=0\\right] \\\\ \\text{Equivalentemente (vía matriz): sea } A=[\\mathbf{v}_1|\\cdots|\\mathbf{v}_k] \\in \\mathbb{R}^{n\\times k}: \\\\ \\quad \\{\\mathbf{v}_i\\} \\text{ L.I.} \\iff \\mathcal{N}(A)=\\{\\mathbf{0}\\} \\iff \\operatorname{rank}(A)=k \\\\ \\text{L.D.: } \\exists\\,(\\alpha_1,\\ldots,\\alpha_k)\\neq\\mathbf{0}: \\sum_i\\alpha_i\\mathbf{v}_i=\\mathbf{0} \\\\ \\quad \\iff \\exists\\, j: \\mathbf{v}_j \\in \\operatorname{span}(\\{\\mathbf{v}_i\\}_{i\\neq j})",
      geometric: "k > n \\implies \\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\} \\text{ L.D. en } \\mathbb{R}^n \\quad (\\text{más vectores que dimensiones}) \\\\ \\text{L.I.} \\iff \\text{det}([\\mathbf{v}_1|\\cdots|\\mathbf{v}_n]) \\neq 0 \\quad (\\text{solo si } k=n) \\\\ \\text{Gram: } G_{ij} = \\langle\\mathbf{v}_i,\\mathbf{v}_j\\rangle;\\quad \\{\\mathbf{v}_i\\}\\text{ L.I.}\\iff \\det(G)\\neq 0",
      properties: [
        "\\text{Todo subconjunto de un conjunto L.I. es L.I.; todo superconjunto de uno L.D. es L.D.}",
        "\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\} \\text{ L.I.} \\iff \\text{cada } \\mathbf{w}\\in\\operatorname{span}(\\{\\mathbf{v}_i\\}) \\text{ tiene representación única}",
        "\\text{Criterio de Gram: } \\{\\mathbf{v}_i\\} \\text{ L.I.} \\iff \\det(V^\\top V)>0 \\quad (V=[\\mathbf{v}_1|\\cdots|\\mathbf{v}_k])",
      ],
    },
    intuition: "La independencia lineal es la ausencia de redundancia: cada vector del conjunto aporta una dirección genuinamente nueva que no puede construirse combinando los demás. Imagina construir un mapa: si ya tienes las direcciones Norte y Este, añadir 'Noreste' es redundante — es la suma de los dos primeros. En $\\mathbb{R}^2$, dos vectores son L.I. si apuntan en direcciones distintas (no paralelas); tres vectores en $\\mathbb{R}^2$ son siempre L.D. porque no hay espacio para una tercera dirección independiente. En ML, la L.I. de los embeddings garantiza que el modelo pueda distinguir conceptos sin ambigüedad; la dependencia lineal entre features de entrada provoca multicolinealidad y degrada la estabilidad numérica.",
    development: [
      {
        label: "Caracterizaciones algebraicas y el test del rango",
        body: "Hay varias formas equivalentes de verificar la L.I. de $\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\}$, cada una computacionalmente distinta:\n\n**1. Definición directa**: resolver $A\\mathbf{\\alpha}=\\mathbf{0}$ con $A=[\\mathbf{v}_1|\\cdots|\\mathbf{v}_k]$. Si la única solución es $\\mathbf{\\alpha}=\\mathbf{0}$ (núcleo trivial), los vectores son L.I.\n\n**2. Rango**: $\\operatorname{rank}(A)=k$ equivale a L.I. Computable eficientemente via eliminación gaussiana o SVD.\n\n**3. Determinante** (solo para $k=n$ vectores en $\\mathbb{R}^n$): $\\det(A)\\neq 0 \\iff$ L.I.\n\n**4. Valores singulares**: los vectores son L.I. si y solo si todos los valores singulares de $A$ son positivos. El valor singular mínimo $\\sigma_{\\min}(A) > 0$ mide cuán 'lejos' está el conjunto de la dependencia — es el recíproco del número de condición $\\kappa=\\sigma_{\\max}/\\sigma_{\\min}$.\n\n**5. Matriz de Gram** $G = A^\\top A$: $\\det(G) > 0 \\iff$ L.I. La raíz cuadrada de $\\det(G)$ es el volumen del paralelepípedo formado por los vectores."
      },
      {
        label: "Dependencia lineal: geometría y consecuencias",
        body: "Cuando un conjunto es L.D., existe $\\mathbf{\\alpha}\\neq\\mathbf{0}$ tal que $A\\mathbf{\\alpha}=\\mathbf{0}$, lo que significa que $\\mathbf{\\alpha}$ está en el núcleo de $A$. Geométricamente:\n\n- **2 vectores L.D.**: son paralelos (uno es múltiplo del otro). Su span es una recta.\n- **3 vectores en $\\mathbb{R}^2$**: siempre L.D. — no hay 'espacio' para una tercera dirección.\n- **3 vectores L.D. en $\\mathbb{R}^3$**: coplanares (span = plano o menos).\n\nLa dependencia tiene consecuencias prácticas graves:\n\n- **Sistemas $A\\mathbf{x}=\\mathbf{b}$**: si $A$ tiene columnas L.D., la solución no es única (hay infinitas o ninguna). El sistema está **subdeterminado** o **mal condicionado**.\n- **Regresión con features correladas** (multicolinealidad): $(X^\\top X)^{-1}$ se vuelve inestable o singular, los coeficientes tienen varianza enorme y son difíciles de interpretar.\n- **Embeddings degenerados**: si los embeddings de $k$ tokens son L.D. y viven en un subespacio de dimensión $r<k$, el modelo tiene redundancia representacional — $k-r$ grados de libertad 'perdidos'."
      },
      {
        label: "Proceso de Gram-Schmidt: ortonormalización y extracción de base L.I.",
        body: "Dado un conjunto L.I. $\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\}$, el **proceso de Gram-Schmidt** construye una base ortonormal $\\{\\mathbf{q}_1,\\ldots,\\mathbf{q}_k\\}$ con el mismo span:\n$$\\mathbf{u}_j = \\mathbf{v}_j - \\sum_{i=1}^{j-1}\\frac{\\langle\\mathbf{v}_j,\\mathbf{q}_i\\rangle}{\\|\\mathbf{q}_i\\|}\\mathbf{q}_i, \\qquad \\mathbf{q}_j = \\frac{\\mathbf{u}_j}{\\|\\mathbf{u}_j\\|}$$\n\nEsto es la factorización $A = QR$ donde $Q \\in \\mathbb{R}^{n\\times k}$ tiene columnas ortonormales y $R \\in \\mathbb{R}^{k\\times k}$ es triangular superior. Si algún $\\|\\mathbf{u}_j\\| = 0$, el vector $\\mathbf{v}_j$ es redundante (L.D. con los anteriores) y se descarta.\n\nLa factorización QR es el algoritmo estándar para:\n- Resolver sistemas de mínimos cuadrados establamente: $\\hat{\\mathbf{x}} = R^{-1}Q^\\top\\mathbf{b}$.\n- Detectar rango numéricamente: el rango es el número de diagonales de $R$ mayores que un umbral.\n- Ortonormalizar las cabezas de atención para mejorar la estabilidad del entrenamiento."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "La independencia lineal determina la calidad representacional y la estabilidad numérica en múltiples niveles:\n\n**Multicolinealidad y regresión.** En regresión lineal $\\mathbf{y} = X\\boldsymbol{\\beta} + \\boldsymbol{\\varepsilon}$ con $X \\in \\mathbb{R}^{n\\times p}$, si las columnas de $X$ son casi L.D. (features correladas), $X^\\top X$ es casi singular: $\\sigma_{\\min}(X) \\approx 0$ y $\\hat{\\boldsymbol{\\beta}} = (X^\\top X)^{-1}X^\\top\\mathbf{y}$ es numéricamente inestable. Ridge regresión añade $\\lambda I$ para regularizar: $(X^\\top X + \\lambda I)^{-1}$ tiene $\\sigma_{\\min} \\geq \\lambda > 0$ garantizado.\n\n**Hipótesis de superposición en LLMs.** Los LLMs tienen más conceptos que dimensiones ($p_{\\text{conceptos}} \\gg d_{\\text{model}}$). Elhage et al. (2022) demostraron que los modelos almacenan features en **vectores casi L.I.** (casi ortogonales), con interferencia controlada por $1/\\sqrt{d}$. Este régimen de superposición es imposible sin independencia lineal parcial de las representaciones.\n\n**Rango de las matrices de atención.** Si $W_Q, W_K \\in \\mathbb{R}^{d\\times d_k}$ tienen columnas casi L.D. (rango efectivo $r \\ll d_k$), la cabeza de atención opera en un subespacio de dimensión $r$ — reducción efectiva de capacidad. El entrenamiento con inicialización ortogonal y weight decay mantiene los valores singulares separados de cero, preservando la independencia.\n\n**Colapso de gradiente y L.I.** Durante el entrenamiento, si los gradientes de distintos parámetros se vuelven L.D. (colineales), el espacio de actualización colapsa: $\\nabla_{\\theta_1}\\mathcal{L} \\approx \\alpha \\nabla_{\\theta_2}\\mathcal{L}$ significa que actualizar $\\theta_1$ y $\\theta_2$ es redundante. El **gradient clipping** y la **preconditioning** (AdaGrad, Adam) actúan sobre el espectro del Hessiano para mantener las direcciones de descenso efectivamente independientes."
      },
    ],
    code: `import numpy as np
from typing import Optional

# ── 1. Test de independencia lineal vía rango ─────────────────────────────────
def test_li(vectores: list[np.ndarray], tol: float = 1e-8) -> dict:
    """
    Verifica L.I. usando SVD: LI ↔ rank(A) = k ↔ σ_min > 0.
    """
    A = np.column_stack(vectores)
    _, s, _ = np.linalg.svd(A, full_matrices=False)
    r = int(np.sum(s > tol))
    return {
        "LI":              r == len(vectores),
        "rango":           r,
        "k":               len(vectores),
        "redundantes":     len(vectores) - r,
        "sigma_min":       float(s[-1]),
        "sigma_max":       float(s[0]),
        "cond_number":     float(s[0] / (s[-1] + 1e-300)),
        "valores_sing":    s.round(4),
        "det_gram":        float(np.linalg.det(A.T @ A)),
    }

print("=== Test de independencia lineal ===")
casos = [
    ("L.I.: (1,0,0),(0,1,0),(0,0,1)",
     [np.array([1.,0.,0.]), np.array([0.,1.,0.]), np.array([0.,0.,1.])]),
    ("L.D.: (1,2),(2,4) (paralelos)",
     [np.array([1.,2.]),    np.array([2.,4.])]),
    ("L.I.: (1,1),(1,-1)",
     [np.array([1.,1.]),    np.array([1.,-1.])]),
    ("L.D.: 3 vecs en ℝ² (k>n)",
     [np.array([1.,0.]),    np.array([0.,1.]),    np.array([1.,1.])]),
    ("Casi L.D.: alta correlación",
     [np.array([1.,0.]),    np.array([0.999, 0.045])]),
]
for nombre, vecs in casos:
    res = test_li(vecs)
    mark = "✓ LI" if res["LI"] else "✗ LD"
    print(f"  {mark} {nombre}")
    print(f"       rank={res['rango']}/{res['k']}  σ_min={res['sigma_min']:.4f}  "
          f"κ={res['cond_number']:.2f}  det(G)={res['det_gram']:.4f}")

# ── 2. Resolución de la ecuación de dependencia: encontrar coeficientes ────────
def coeficientes_dependencia(vectores: list[np.ndarray], tol=1e-8) -> Optional[np.ndarray]:
    """
    Si los vectores son L.D., devuelve α≠0 tal que Σ αᵢ vᵢ = 0.
    """
    A = np.column_stack(vectores)
    _, s, Vt = np.linalg.svd(A)
    idx_nulos = np.where(s < tol)[0]
    if len(idx_nulos) == 0:
        # También chequear dimensión nula por exceso de vectores
        if A.shape[1] > A.shape[0]:
            # Hay núcleo garantizado
            _, _, Vt = np.linalg.svd(A, full_matrices=True)
            return Vt[A.shape[0]:][0]
        return None                                    # L.I.
    return Vt[len(s):][0] if len(s) < A.shape[1] else Vt[idx_nulos[0]]

print("\\n=== Coeficientes de dependencia lineal ===")
deps = [
    ([np.array([1.,2.]), np.array([2.,4.])],          "v₂ = 2v₁"),
    ([np.array([1.,0.]), np.array([0.,1.]), np.array([1.,1.])], "v₃ = v₁+v₂"),
    ([np.array([1.,0.]), np.array([0.,1.])],           "L.I. (ninguna)"),
]
for vecs, expected in deps:
    alpha = coeficientes_dependencia(vecs)
    if alpha is not None:
        recomb = sum(a*v for a,v in zip(alpha, vecs))
        print(f"  α={alpha.round(4)} → Σαᵢvᵢ={recomb.round(6)}  (esperado: {expected})")
    else:
        print(f"  → Linealmente independientes ({expected})")

# ── 3. Gram-Schmidt: ortonormalización ────────────────────────────────────────
def gram_schmidt(vectores: list[np.ndarray], tol: float = 1e-10) -> tuple:
    """
    Proceso de Gram-Schmidt con detección de redundancia.
    Devuelve (Q, indices_base) donde Q tiene columnas ortonormales.
    """
    n = len(vectores[0])
    Q_cols = []
    indices_base = []

    for j, v in enumerate(vectores):
        u = v.copy().astype(float)
        for q in Q_cols:
            u -= np.dot(u, q) * q          # proyectar fuera de los anteriores
        norm_u = np.linalg.norm(u)
        if norm_u > tol:                   # no redundante
            Q_cols.append(u / norm_u)
            indices_base.append(j)
        # Si norm_u ≈ 0: v_j era combinación lineal de los anteriores → redundante

    Q = np.column_stack(Q_cols) if Q_cols else np.zeros((n, 0))
    return Q, indices_base

print("\\n=== Gram-Schmidt y extracción de base L.I. ===")
vecs_test = [
    np.array([1., 2., 0.]),
    np.array([3., 4., 0.]),
    np.array([2., 4., 0.]),   # redundante: 2*(1,2,0)
    np.array([0., 0., 1.]),
]
Q, idx_base = gram_schmidt(vecs_test)
print(f"  Vectores: {len(vecs_test)}  →  Base L.I.: {len(idx_base)} (índices: {idx_base})")
print(f"  Q (columnas ortonormales):\\n{Q.round(4)}")
print(f"  QᵀQ = I: {np.allclose(Q.T @ Q, np.eye(len(idx_base)))}")

# Verificar igualdad de spans
A_orig = np.column_stack(vecs_test)
# Residuo de las cols de A respecto a span(Q): debe ser ≈ 0
residuos = [np.linalg.norm(v - Q @ (Q.T @ v)) for v in vecs_test]
print(f"  Residuos ‖vⱼ - P·vⱼ‖: {np.array(residuos).round(6)} (≈0 si span igual)")

# ── 4. Multicolinealidad en regresión: efecto en el número de condición ────────
print("\\n=== Multicolinealidad: κ(XᵀX) y estabilidad de β̂ ===")
np.random.seed(42)
n_obs = 100

# Feature base
x1 = np.random.randn(n_obs)

for corr, desc in [(0.0, "sin corr"), (0.8, "corr=0.8"),
                   (0.99, "corr=0.99"), (0.999, "corr=0.999")]:
    x2 = corr*x1 + np.sqrt(1-corr**2)*np.random.randn(n_obs)
    X  = np.column_stack([np.ones(n_obs), x1, x2])
    XtX= X.T @ X
    s  = np.linalg.svd(XtX, compute_uv=False)
    kappa= s[0]/(s[-1]+1e-12)
    try:
        beta = np.linalg.solve(XtX, X.T @ (2*x1 - x2 + np.random.randn(n_obs)*0.1))
        stable = True
    except np.linalg.LinAlgError:
        stable = False
    print(f"  {desc}: σ_min={s[-1]:.4f}  κ={kappa:.1f}  "
          f"{'estable' if kappa<1e6 else 'INESTABLE'}")

# ── 5. Hipótesis de superposición: LI aproximada en alta dimensión ────────────
print("\\n=== Hipótesis de superposición: |cos θ| entre embeddings ===")
np.random.seed(0)

for d, n_emb, desc in [
    (4,   10,  "d=4,  10 embeddings"),
    (64,  100, "d=64, 100 embeddings"),
    (512, 500, "d=512, 500 embeddings"),
]:
    E = np.random.randn(d, n_emb)
    E = E / np.linalg.norm(E, axis=0)         # normalizar
    G = E.T @ E                                # Gram matrix
    np.fill_diagonal(G, 0)
    max_cos = np.abs(G).max()
    mean_cos= np.abs(G).mean()
    r = np.linalg.matrix_rank(E)
    print(f"  {desc}: rank={r}  max|cos|={max_cos:.4f}  mean|cos|={mean_cos:.4f}  "
          f"(teórico E[|cos|]≈{1/np.sqrt(d):.4f})")
`,
    related: ["Combinación Lineal y Span", "Base y Dimensión", "Rango de una Matriz", "Multicolinealidad", "Embeddings y Superposición"],
    hasViz: true,
    vizType: "independenciaLineal",
  },
  {
    id: 18, section: "Álgebra Lineal", sectionCode: "II",
    name: "Producto Punto (Dot Product)",
    tags: ["vectores", "geometría"],
    definition: "Operación binaria entre dos vectores del mismo espacio que produce un escalar. Mide la proyección de un vector sobre otro ponderada por las magnitudes.",
    formal: {
      notation: "Sea $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n$",
      body: "\\mathbf{u} \\cdot \\mathbf{v} = \\sum_{i=1}^{n} u_i v_i = u_1v_1 + \\cdots + u_nv_n",
      geometric: "\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta",
      properties: [
        "\\text{Conmutatividad: } \\mathbf{u} \\cdot \\mathbf{v} = \\mathbf{v} \\cdot \\mathbf{u}",
        "\\text{Bilinealidad: } (\\alpha\\mathbf{u}) \\cdot \\mathbf{v} = \\alpha(\\mathbf{u} \\cdot \\mathbf{v})",
        "\\text{Positividad: } \\mathbf{u} \\cdot \\mathbf{u} \\geq 0,\\ \\text{con igualdad ssi}\\ \\mathbf{u} = \\mathbf{0}",
      ],
    },
    intuition: "Si caminas en dirección $\\mathbf{v}$ y el viento sopla en dirección $\\mathbf{u}$, el producto punto mide cuánto te ayuda el viento. Es máximo cuando son paralelos, cero cuando son perpendiculares.",
    development: [
      { label: "Interpretación geométrica", body: "El producto punto $\\mathbf{u}\\cdot\\mathbf{v} = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$ mide cuánto coinciden dos vectores en dirección. Si $\\theta = 0°$, máxima alineación. Si $\\theta = 90°$, ortogonalidad ($\\mathbf{u}\\perp\\mathbf{v}$)." },
      { label: "Proyección vectorial", body: "La proyección de $\\mathbf{u}$ sobre $\\mathbf{v}$: $$\\text{proj}_{\\mathbf{v}}\\mathbf{u} = \\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\|\\mathbf{v}\\|^2}\\mathbf{v}$$ Descompone $\\mathbf{u}$ en componente paralela a $\\mathbf{v}$ y componente ortogonal." },
      { label: "Relación con norma L2", body: "$\\|\\mathbf{u}\\|^2 = \\mathbf{u}\\cdot\\mathbf{u}$ — la norma $L_2$ al cuadrado es el auto producto punto. Esto conecta álgebra lineal con geometría euclídea." },
      { label: "En Machine Learning", body: "En regresión lineal $\\hat{y} = \\mathbf{w}\\cdot\\mathbf{x} + b$, el producto punto es la operación central. Cada neurona computa $a = \\sigma(\\mathbf{w}\\cdot\\mathbf{x} + b)$. En transformers: $\\text{Attn} = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V$." },
    ],
    code: `import numpy as np

u = np.array([3, 1])
v = np.array([2, 2])

dot_alg = np.dot(u, v)           # 3*2 + 1*2 = 8
cos_theta = dot_alg / (np.linalg.norm(u) * np.linalg.norm(v))
theta_deg = np.degrees(np.arccos(cos_theta))   # ≈ 26.6°

# Proyección de u sobre v
proj_uv = (dot_alg / np.dot(v, v)) * v

print(f"u · v     = {dot_alg}")
print(f"θ         = {theta_deg:.1f}°")
print(f"proj_v(u) = {proj_uv}")`,
    related: ["Norma de un vector", "Similitud coseno", "Ortogonalidad", "Producto cruzado"],
    hasViz: true, vizType: "dotproduct",
  },
  {
    id: 59, section: "Probabilidad", sectionCode: "IV",
    name: "Teorema de Bayes",
    tags: ["probabilidad", "inferencia"],
    definition: "Relaciona P(A|B) con P(B|A). Permite actualizar creencias previas (prior) con evidencia nueva para obtener creencias actualizadas (posterior).",
    formal: {
      notation: "Sean $A, B$ eventos con $P(B) > 0$",
      body: "P(A \\mid B) = \\frac{P(B \\mid A)\\, P(A)}{P(B)}",
      geometric: "P(B) = \\sum_i P(B \\mid A_i)\\,P(A_i) \\quad \\text{(probabilidad total)}",
      properties: [
        "\\text{Posterior} \\propto \\text{Likelihood} \\times \\text{Prior}",
        "P(A_k|B) = \\dfrac{P(B|A_k)P(A_k)}{\\displaystyle\\sum_i P(B|A_i)P(A_i)}",
        "\\text{Forma continua: } p(\\theta|\\mathcal{D}) = \\dfrac{p(\\mathcal{D}|\\theta)\\,p(\\theta)}{p(\\mathcal{D})}",
      ],
    },
    intuition: "Test médico con 99% precisión, enfermedad en 0.1% de la población. Si das positivo, la probabilidad real de estar enfermo es ~9%. La rareza de la enfermedad (prior débil) domina sobre la sensibilidad del test.",
    development: [
      { label: "Nomenclatura formal", body: "$P(A)$ = Prior: creencia antes de observar evidencia\n$P(B|A)$ = Likelihood: verosimilitud de la evidencia dado $A$\n$P(B)$ = Evidencia marginal: constante de normalización\n$P(A|B)$ = Posterior: creencia actualizada con evidencia" },
      { label: "Forma continua e intratabilidad", body: "Para parámetro $\\theta$ y datos $\\mathcal{D}$: $$p(\\theta \\mid \\mathcal{D}) = \\frac{p(\\mathcal{D} \\mid \\theta)\\, p(\\theta)}{p(\\mathcal{D})}$$ donde $p(\\mathcal{D}) = \\int p(\\mathcal{D}|\\theta)\\,p(\\theta)\\,d\\theta$ es frecuentemente intratable → necesitamos MCMC o VI." },
      { label: "MLE vs MAP vs Bayesiano pleno", body: "MLE: $\\hat{\\theta} = \\arg\\max_\\theta \\log p(\\mathcal{D}|\\theta)$ — ignora el prior.\n\nMAP: $\\hat{\\theta} = \\arg\\max_\\theta [\\log p(\\mathcal{D}|\\theta) + \\log p(\\theta)]$\n\nMAP con prior $p(\\theta) = \\mathcal{N}(0, \\sigma^2I)$ equivale exactamente a regularización $L_2$ con $\\lambda = 1/\\sigma^2$." },
      { label: "Actualización secuencial", body: "El posterior de hoy es el prior de mañana: $$p(\\theta | x_{1:n}) \\propto p(x_n|\\theta)\\cdot p(\\theta|x_{1:n-1})$$ Permite aprendizaje online. En familias conjugadas (Beta-Binomial, Normal-Normal), la actualización tiene forma cerrada." },
    ],
    code: `# Ejemplo clásico: test médico con paradoja de prevalencia
P_enfermo = 0.001           # Prior: prevalencia 0.1%
P_pos_dado_enfermo = 0.99   # Sensibilidad (TPR)
P_pos_dado_sano   = 0.01    # 1 - Especificidad (FPR)

# Ley de probabilidad total
P_pos = (P_pos_dado_enfermo * P_enfermo +
         P_pos_dado_sano * (1 - P_enfermo))

# Bayes
posterior = (P_pos_dado_enfermo * P_enfermo) / P_pos

print(f"P(positivo)           = {P_pos:.4f}")
print(f"P(enfermo | positivo) = {posterior:.3f}")  # ≈ 0.090

# Forma log (numéricamente estable)
import numpy as np
log_posterior = (np.log(P_pos_dado_enfermo) + np.log(P_enfermo)
                 - np.log(P_pos))
print(f"log P(E|+)            = {log_posterior:.3f}")`,
    related: ["Distribución conjunta", "Inferencia bayesiana", "MLE", "MAP"],
    hasViz: true, vizType: "bayes",
  },
  {
    id: 39, section: "Cálculo y Optimización", sectionCode: "III",
    name: "Gradiente",
    tags: ["cálculo", "optimización"],
    definition: "Vector de derivadas parciales de una función escalar f: ℝⁿ → ℝ. Apunta en la dirección de máximo crecimiento local. Su negativo es la dirección de máximo descenso.",
    formal: {
      notation: "Sea $f: \\mathbb{R}^n \\to \\mathbb{R}$ diferenciable en $\\mathbf{x}$",
      body: "\\nabla f(\\mathbf{x}) = \\left(\\frac{\\partial f}{\\partial x_1},\\, \\frac{\\partial f}{\\partial x_2},\\, \\ldots,\\, \\frac{\\partial f}{\\partial x_n}\\right)^\\top \\in \\mathbb{R}^n",
      geometric: "D_{\\mathbf{u}}f(\\mathbf{x}) = \\nabla f(\\mathbf{x}) \\cdot \\mathbf{u},\\quad \\|\\mathbf{u}\\|=1 \\quad \\text{(derivada direccional)}",
      properties: [
        "\\nabla(f + g) = \\nabla f + \\nabla g \\quad \\text{(linealidad)}",
        "\\nabla(\\mathbf{a}^\\top\\mathbf{x}) = \\mathbf{a}",
        "\\nabla(\\mathbf{x}^\\top A\\mathbf{x}) = (A + A^\\top)\\mathbf{x} = 2A\\mathbf{x}\\ \\text{ si } A \\text{ simétrica}",
        "\\|\\nabla f(\\mathbf{x})\\| = \\max_{\\|\\mathbf{u}\\|=1} D_{\\mathbf{u}}f(\\mathbf{x}) \\quad \\text{(tasa máxima de cambio)}",
      ],
    },
    intuition: "Imagina una superficie montañosa. El gradiente en cada punto es la flecha apuntando hacia la pendiente más empinada hacia arriba. El descenso del gradiente sigue $-\\nabla f$, siempre cuesta abajo hacia el mínimo.",
    development: [
      { label: "Analítico vs numérico", body: "Analítico: cálculo exacto mediante reglas de derivación. Siempre preferido en la práctica.\n\nNumérico (diferencias finitas centradas): $$\\frac{\\partial f}{\\partial x_i} \\approx \\frac{f(\\mathbf{x} + h\\mathbf{e}_i) - f(\\mathbf{x} - h\\mathbf{e}_i)}{2h} + O(h^2)$$ Costo: $2n$ evaluaciones de $f$ por gradiente. Útil para verificar implementaciones." },
      { label: "Condición de optimalidad", body: "Condición necesaria de primer orden: $$\\nabla f(\\mathbf{x}^*) = \\mathbf{0}$$ No es suficiente. Se analiza la Hessiana $H = \\nabla^2 f(\\mathbf{x}^*)$:\n— $H \\succ 0$ (definida positiva): mínimo local.\n— $H \\prec 0$: máximo local.\n— $H$ indefinida: punto de silla (problema en deep learning)." },
      { label: "Descenso del gradiente", body: "Regla de actualización: $$\\mathbf{x}_{t+1} = \\mathbf{x}_t - \\eta \\nabla f(\\mathbf{x}_t)$$ Converge si $f$ es $L$-suave (Lipschitz-continua en el gradiente) con $\\eta < 2/L$. Para $f$ convexa: tasa $O(1/t)$. Para $f$ fuertemente convexa: tasa $O(\\rho^t)$ exponencial." },
      { label: "Regla de la cadena → Backprop", body: "Para $z = f(g(\\mathbf{x}))$ con $g: \\mathbb{R}^n \\to \\mathbb{R}^m$: $$\\nabla_{\\mathbf{x}} z = J_g^\\top \\nabla_g f$$ donde $J_g \\in \\mathbb{R}^{m\\times n}$ es la Jacobiana. El backpropagation aplica esta regla recursivamente hacia atrás en el grafo computacional." },
    ],
    code: `import numpy as np

# f(x, y) = x² + 2y²
f     = lambda x, y: x**2 + 2*y**2
grad  = lambda x, y: np.array([2*x, 4*y])

# Verificación numérica (diferencias centradas)
def grad_num(x, y, h=1e-5):
    return np.array([
        (f(x+h,y) - f(x-h,y)) / (2*h),
        (f(x,y+h) - f(x,y-h)) / (2*h),
    ])

print(np.allclose(grad(2, 1), grad_num(2, 1)))  # True

# Descenso del gradiente
x, y, lr = 3.0, 3.0, 0.1
for t in range(30):
    g = grad(x, y)
    x -= lr * g[0]
    y -= lr * g[1]

print(f"Mínimo: ({x:.6f}, {y:.6f})")   # → (0, 0)
print(f"f_min = {f(x,y):.2e}")`,
    related: ["Derivadas parciales", "Matriz Hessiana", "Backpropagation", "Adam"],
    hasViz: true, vizType: "gradient",
  },
  {
    id: 118, section: "LLMs Avanzados", sectionCode: "IX",
    name: "Temperatura y Sampling",
    tags: ["LLMs", "generación"],
    definition: "Parámetros que controlan la aleatoriedad en la generación de tokens. Modifican la distribución de probabilidad sobre el vocabulario antes de muestrear el siguiente token.",
    formal: {
      notation: "Sea $\\mathbf{z} \\in \\mathbb{R}^{|V|}$ el vector de logits del modelo sobre vocabulario $V$",
      body: "P(w_i) = \\frac{e^{z_i / T}}{\\displaystyle\\sum_{j \\in V} e^{z_j / T}}",
      geometric: "H(P_T) = -\\sum_i P_T(w_i)\\log P_T(w_i) \\nearrow \\text{ monotónamente con } T",
      properties: [
        "T \\to 0^+:\\  \\text{colapsa a argmax (greedy decoding)}",
        "T = 1:\\  \\text{distribución original del modelo}",
        "T \\to \\infty:\\  \\text{distribución uniforme } (H = \\log|V|)",
        "\\text{Top-p: } V_p = \\arg\\min_{S} |S|\\ \\text{s.t.}\\ \\sum_{w\\in S}P(w) \\geq p",
      ],
    },
    intuition: "La temperatura es el 'nerviosismo' del modelo. Con $T$ baja elige lo más seguro. Con $T$ alta se vuelve creativo. Top-p adapta el pool de candidatos según cuán concentrada esté la distribución — elegante porque es automático.",
    development: [
      { label: "Greedy vs Beam vs Sampling", body: "Greedy: $w_t = \\arg\\max_w P(w|\\text{ctx})$ — determinista, propenso a repetición.\n\nBeam search: mantiene $k$ hipótesis en paralelo, maximiza $\\prod_t P(w_t|w_{<t})$.\n\nSampling: $w_t \\sim P(\\cdot|\\text{ctx})$ — estocástico, mayor diversidad." },
      { label: "Top-k sampling", body: "1. Retener top-$k$ tokens por probabilidad\n2. Asignar $P = 0$ al resto\n3. Renormalizar y muestrear\n\nProblema: $k$ fijo no se adapta. Si el modelo tiene alta certeza, $k=50$ incluye tokens basura con probabilidad no trivial." },
      { label: "Top-p (Nucleus) sampling", body: "Seleccionar conjunto mínimo $V_p \\subseteq V$: $$\\sum_{w \\in V_p} P(w) \\geq p$$ con $V_p$ ordenado por probabilidad descendente. Si el modelo está seguro, $|V_p|$ es pequeño; si inseguro, $|V_p|$ crece. Adaptativo por diseño." },
      { label: "Temperatura + Top-p en práctica", body: "Aplicar $T$ primero (reescalar logits), luego top-p (truncar distribución).\n\nCódigo: $T \\in [0.1, 0.3]$, top-p alto → precisión.\nTexto creativo: $T \\in [0.7, 1.0]$, top-p $\\approx 0.9$ → diversidad.\n\nLa entropía del modelo bajo temperatura $T$: $$H_T = H_1 / T + \\text{términos de corrección}$$" },
    ],
    code: `import numpy as np

def softmax_T(logits, T=1.0):
    """Softmax con temperatura. Estabilidad numérica via max-shift."""
    z = logits / T
    z -= z.max()
    exp_z = np.exp(z)
    return exp_z / exp_z.sum()

def nucleus_sample(probs, p=0.9, rng=None):
    """Top-p (nucleus) sampling."""
    rng = rng or np.random.default_rng()
    idx = np.argsort(probs)[::-1]
    cumprobs = np.cumsum(probs[idx])
    cutoff = np.searchsorted(cumprobs, p) + 1
    nucleus = idx[:cutoff]
    nucleus_probs = probs[nucleus] / probs[nucleus].sum()
    return rng.choice(nucleus, p=nucleus_probs)

logits = np.array([4.2, 2.1, 1.5, 0.8, 0.3, -0.5])
for T in [0.2, 1.0, 2.0]:
    probs = softmax_T(logits, T)
    print(f"T={T}: entropy={(-probs*np.log(probs+1e-9)).sum():.2f}")`,
    related: ["Modelo de lenguaje causal", "Perplejidad", "Beam search", "Entropía de Shannon"],
    hasViz: true, vizType: "temperature",
  },

  // ── SECCIÓN II: ÁLGEBRA LINEAL ─────────────────────────────────────────
  {
    id: 26,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Determinante y Rango de una Matriz",
    tags: ["álgebra lineal", "determinante", "rango", "invertibilidad", "espacio columna", "nulidad"],
    definition: "El determinante $\\det(A) \\in \\mathbb{R}$ de una matriz cuadrada $A \\in \\mathbb{R}^{n\\times n}$ mide el factor de escala con signo por el cual $A$ multiplica volúmenes orientados en $\\mathbb{R}^n$. El rango $\\text{rank}(A)$ de cualquier matriz $A \\in \\mathbb{R}^{m\\times n}$ es la dimensión de su espacio columna (o fila), es decir, el número de columnas (o filas) linealmente independientes. Ambos conceptos codifican la misma pregunta fundamental: ¿colapsa $A$ el espacio a una dimensión menor?",
    formal: {
      notation: "Sea $A \\in \\mathbb{R}^{n \\times n}$ y $B \\in \\mathbb{R}^{m \\times n}$",
      body: "\\det(A) = \\sum_{\\sigma \\in S_n} \\text{sgn}(\\sigma) \\prod_{i=1}^n a_{i,\\sigma(i)} \\\\[10pt] \\text{rank}(B) = \\dim(\\text{Col}(B)) = \\dim(\\text{Row}(B)) = n - \\dim(\\ker(B))",
      geometric: "\\det(A) = \\text{Vol orientado del paralelepípedo formado por las columnas de } A",
      properties: [
        "\\det(AB) = \\det(A)\\det(B), \\quad \\det(A^\\top) = \\det(A), \\quad \\det(A^{-1}) = 1/\\det(A)",
        "A \\text{ invertible} \\iff \\det(A) \\neq 0 \\iff \\text{rank}(A) = n \\iff \\ker(A) = \\{\\mathbf{0}\\}",
        "\\text{Rango-Nulidad: } \\text{rank}(B) + \\text{nullity}(B) = n, \\quad \\text{nullity}(B) = \\dim(\\ker(B))",
      ],
    },
    intuition: "El determinante es el 'factor de zoom con signo' de una transformación: $|\\det(A)| = 2$ significa que $A$ duplica todos los volúmenes; $\\det(A) = 0$ significa que $A$ aplasta el espacio a una dimensión menor (colapso irreversible). El signo indica si la orientación se preserva ($+$) o invierte ($-$). El rango cuenta cuántas dimensiones 'sobreviven' a la transformación: si $\\text{rank}(A) = r < n$, la imagen de $A$ es un subespacio de dimensión $r$, y toda la información en las $n-r$ dimensiones restantes se pierde.",
    development: [
      {
        label: "Determinante: definición y cálculo",
        body: "Para $n=2$: $\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix} = ad - bc$, el área con signo del paralelogramo formado por las columnas.\n\nPara $n=3$, la **regla de Sarrus** o expansión por cofactores:\n\n$$\\det(A) = \\sum_{j=1}^n a_{ij}\\,C_{ij}, \\quad C_{ij} = (-1)^{i+j}M_{ij}$$\n\ndonde $M_{ij}$ es el menor $(i,j)$: el determinante de la submatriz obtenida eliminando fila $i$ y columna $j$.\n\nPropiedades operativas clave: (1) intercambiar dos filas cambia el signo, (2) multiplicar una fila por $\\alpha$ escala el determinante por $\\alpha$, (3) añadir un múltiplo de una fila a otra no cambia el determinante. Estas tres operaciones elementales son la base de la eliminación gaussiana para calcular $\\det$ en $\\mathcal{O}(n^3)$: $\\det(A) = \\prod_i u_{ii}$ donde $U$ es la forma escalonada."
      },
      {
        label: "Rango: definición, cálculo e interpretación",
        body: "El rango de $A \\in \\mathbb{R}^{m\\times n}$ es la dimensión del **espacio columna** $\\text{Col}(A) = \\{A\\mathbf{x} : \\mathbf{x}\\in\\mathbb{R}^n\\} \\subseteq \\mathbb{R}^m$. Un teorema no trivial garantiza que el **rango columna = rango fila** siempre.\n\nAlgoritmo práctico: aplicar eliminación gaussiana y contar las filas no nulas (pivotes). Equivalentemente, a través de SVD:\n\n$$\\text{rank}(A) = \\#\\{\\sigma_i > 0\\}$$\n\ndonde $\\sigma_i$ son los valores singulares. El **Teorema Rango-Nulidad** conecta rango con el kernel:\n\n$$\\underbrace{\\text{rank}(A)}_{\\text{dim Im}(A)} + \\underbrace{\\text{nullity}(A)}_{\\text{dim ker}(A)} = n$$\n\nSi $\\text{rank}(A) = r$, entonces $A$ se puede descomponer como suma de $r$ matrices de rango 1: $A = \\sum_{i=1}^r \\sigma_i \\mathbf{u}_i\\mathbf{v}_i^\\top$ (SVD truncada)."
      },
      {
        label: "Conexión entre determinante y rango",
        body: "Para matrices cuadradas $A \\in \\mathbb{R}^{n\\times n}$, las siguientes afirmaciones son todas equivalentes:\n\n$$\\det(A) \\neq 0 \\iff \\text{rank}(A) = n \\iff \\ker(A) = \\{\\mathbf{0}\\} \\iff A \\text{ invertible}$$\n\n$$\\iff A\\mathbf{x}=\\mathbf{b} \\text{ tiene solución única } \\forall \\mathbf{b} \\iff \\text{columnas de } A \\text{ son L.I.}$$\n\nCuando $\\det(A) = 0$ ($A$ singular), $\\text{rank}(A) < n$ y el sistema $A\\mathbf{x}=\\mathbf{b}$ puede no tener solución (si $\\mathbf{b} \\notin \\text{Col}(A)$) o tener infinitas (si $\\mathbf{b} \\in \\text{Col}(A)$). Nunca tiene solución única.\n\nPara matrices rectangulares $A \\in \\mathbb{R}^{m\\times n}$, el determinante no está definido, pero el rango sí: $\\text{rank}(A) \\leq \\min(m,n)$. La **deficiencia de rango** $\\min(m,n) - \\text{rank}(A)$ mide cuántas dimensiones colapsan."
      },
      {
        label: "En Machine Learning",
        body: "El rango es omnipresente en ML:\n\n**Sistemas sobredeterminados** ($m > n$): la matriz de diseño $X \\in \\mathbb{R}^{m\\times n}$ tiene $\\text{rank}(X) = n$ (rango completo) si y solo si $X^\\top X$ es invertible y la solución de mínimos cuadrados es única: $\\hat{\\boldsymbol{\\beta}} = (X^\\top X)^{-1}X^\\top\\mathbf{y}$.\n\n**Multicolinealidad**: si columnas de $X$ son casi linealmente dependientes, $\\text{rank}(X) < n$ numéricamente, $X^\\top X$ es casi singular ($\\det \\approx 0$), y la inversión amplifica errores. Ridge ($+\\lambda I$) regulariza elevando todos los eigenvalores.\n\n**Low-rank approximation**: en redes neuronales grandes (LLMs), las matrices de peso $W \\in \\mathbb{R}^{d\\times d}$ suelen tener rango efectivo $r \\ll d$. **LoRA** (Low-Rank Adaptation) explota esto:\n\n$$W \\approx W_0 + \\Delta W = W_0 + BA, \\quad B\\in\\mathbb{R}^{d\\times r},\\ A\\in\\mathbb{R}^{r\\times d},\\ r\\ll d$$\n\nreduciendo parámetros entrenables de $d^2$ a $2rd$. El determinante aparece en **modelos generativos con flujos normalizantes** (Normalizing Flows): el cambio de variable requiere $|\\det(J_f)|$ donde $J_f$ es el Jacobiano, y arquitecturas como RealNVP lo calculan eficientemente."
      },
    ],
    code: `import numpy as np
from numpy.linalg import det, matrix_rank, svd, inv

# ── 1. Determinante: casos n=2,3 y propiedades ─────────────────────────────
A2 = np.array([[3., 1.],
               [2., 4.]])
print(f"det(A₂×₂) = {det(A2):.4f}")   # 3·4 - 1·2 = 10

A3 = np.array([[1., 2., 3.],
               [0., 4., 5.],
               [1., 0., 6.]])
print(f"det(A₃×₃) = {det(A3):.4f}")   # expansión cofactores

# Propiedades multiplicativas
B2 = np.array([[2., -1.], [0., 3.]])
print(f"det(A)·det(B) = {det(A2)*det(B2):.4f}")
print(f"det(AB)       = {det(A2 @ B2):.4f}")     # deben ser iguales

# Escalar: det(αA) = αⁿ·det(A)
alpha = 2.0
n = 2
print(f"det(αA) = {det(alpha*A2):.4f}")
print(f"αⁿ·det(A) = {alpha**n * det(A2):.4f}")   # iguales

# ── 2. Determinante como volumen orientado ─────────────────────────────────
# Columnas de A2 forman un paralelogramo: área = |det|
col1 = A2[:, 0]   # [3, 2]
col2 = A2[:, 1]   # [1, 4]
area_cross = abs(col1[0]*col2[1] - col1[1]*col2[0])
print(f"\\n|det(A)| = {abs(det(A2)):.4f} = área paralelogramo = {area_cross:.4f}")

# Inversión de orientación
A_swap = A2[:, [1, 0]]   # intercambiar columnas
print(f"det tras swap cols: {det(A_swap):.4f}")   # cambia signo

# ── 3. Rango: métodos de cálculo ───────────────────────────────────────────
matrices = {
    "Rango máximo (3×3)": np.array([[1.,2.,3.],[4.,5.,6.],[7.,8.,10.]]),
    "Rango deficiente":   np.array([[1.,2.,3.],[4.,5.,6.],[7.,8., 9.]]),  # fila3=fila1+fila2
    "Rectangular (4×2)":  np.random.default_rng(0).standard_normal((4,2)),
}
for nombre, M in matrices.items():
    r = matrix_rank(M)
    m, n_ = M.shape
    nullity = n_ - r
    print(f"\\n{nombre}:")
    print(f"  shape={M.shape}, rank={r}, nullity={nullity}")
    print(f"  rank + nullity = {r+nullity} = n = {n_}  ✓")
    if m == n_:
        print(f"  det={det(M):.4f}  {'(invertible)' if abs(det(M))>1e-10 else '(singular)'}")

# ── 4. Rango via SVD (más estable numéricamente) ───────────────────────────
def rank_svd(A: np.ndarray, tol: float = 1e-10) -> int:
    """Rango numérico: número de valores singulares > tol."""
    _, S, _ = svd(A, full_matrices=False)
    return int(np.sum(S > tol))

# Matriz casi singular (rango numérico = 1 con tol apropiada)
eps = 1e-12
A_almost = np.array([[1., 2.], [2., 4.+eps]])
print(f"\\nMatrix casi singular:")
print(f"  matrix_rank (tol default): {matrix_rank(A_almost)}")
print(f"  rank_svd    (tol=1e-10):   {rank_svd(A_almost, tol=1e-10)}")
print(f"  rank_svd    (tol=1e-15):   {rank_svd(A_almost, tol=1e-15)}")
# El rango numérico depende de la tolerancia elegida

# ── 5. Rango efectivo en matrices de peso de redes neuronales ──────────────
rng = np.random.default_rng(42)

# Simular matriz de peso de rango bajo (LoRA-style)
d, r = 512, 8
A_lora = rng.standard_normal((d, r))
B_lora = rng.standard_normal((r, d))
W_low  = A_lora @ B_lora          # rango real = 8, forma = (512, 512)

_, S_W, _ = svd(W_low, full_matrices=False)
rank_eff_1  = rank_svd(W_low, tol=1e-6)
rank_eff_2  = rank_svd(W_low, tol=1e-10)
var_top8    = np.sum(S_W[:8]**2) / np.sum(S_W**2)

print(f"\\nMatriz LoRA W=AB, shape={W_low.shape}")
print(f"  Rango efectivo (tol=1e-6):  {rank_eff_1}")
print(f"  Rango efectivo (tol=1e-10): {rank_eff_2}")
print(f"  Varianza en top-{r} singulares: {var_top8*100:.2f}%")
print(f"  Params originales: {d*d:,}  →  LoRA: {d*r + r*d:,}  ({100*2*d*r/d**2:.1f}%)")

# ── 6. Determinante y normalizing flows (Jacobiano) ────────────────────────
# Transformación affine acoplada: y = Ax + b
# Log-verosimilitud requiere log|det(J)| = log|det(A)|
def log_det_triangular(L: np.ndarray) -> float:
    """Para matrices triangulares: det = prod(diag) → log|det| = sum(log|diag|)"""
    return float(np.sum(np.log(np.abs(np.diag(L)))))

# Simular Jacobiano triangular (como en RealNVP / flujos de volumen)
L = np.tril(rng.standard_normal((4, 4)))
np.fill_diagonal(L, np.abs(np.diag(L)) + 0.1)  # diag positiva

log_det_fast = log_det_triangular(L)    # O(n)
log_det_full = np.log(abs(det(L)))      # O(n³)
print(f"\\nlog|det(L)| triangular: {log_det_fast:.6f}")
print(f"log|det(L)| completo:   {log_det_full:.6f}  (iguales ✓)")`,
    related: ["Matriz y Tipos", "Eigenvalores y Eigenvectores", "Descomposición SVD", "Transformación Lineal", "Mínimos Cuadrados"],
    hasViz: true,
    vizType: "detRank",
  },
  {
    id: 27,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Inversa y Pseudoinversa (Moore-Penrose)",
    tags: ["álgebra lineal", "inversa", "pseudoinversa", "Moore-Penrose", "mínimos cuadrados", "SVD"],
    definition: "La inversa $A^{-1}$ de una matriz cuadrada $A \\in \\mathbb{R}^{n\\times n}$ existe si y solo si $\\det(A) \\neq 0$, y satisface $AA^{-1} = A^{-1}A = I_n$. La pseudoinversa de Moore-Penrose $A^+ \\in \\mathbb{R}^{n\\times m}$ generaliza la inversa a matrices rectangulares o singulares: existe siempre, es única, y produce la solución de mínima norma al problema de mínimos cuadrados $\\min_{\\mathbf{x}} \\|A\\mathbf{x}-\\mathbf{b}\\|_2$. Se calcula canónicamente a través de SVD.",
    formal: {
      notation: "Sea $A \\in \\mathbb{R}^{m \\times n}$ con SVD $A = U\\Sigma V^\\top$",
      body: "A^+ = V\\Sigma^+ U^\\top, \\quad \\Sigma^+ = \\text{diag}\\!\\left(\\frac{1}{\\sigma_1},\\ldots,\\frac{1}{\\sigma_r},0,\\ldots,0\\right) \\\\[10pt] \\hat{\\mathbf{x}} = A^+\\mathbf{b} = \\arg\\min_{\\mathbf{x}}\\|A\\mathbf{x}-\\mathbf{b}\\|_2 \\quad \\text{con } \\|\\hat{\\mathbf{x}}\\|_2 \\text{ mínima}",
      geometric: "A^+ = \\lim_{\\delta\\to 0^+}(A^\\top A + \\delta I)^{-1}A^\\top = \\lim_{\\delta\\to 0^+} A^\\top(AA^\\top + \\delta I)^{-1}",
      properties: [
        "\\text{Ecuaciones de Moore-Penrose: } AA^+A=A,\\; A^+AA^+=A^+,\\; (AA^+)^\\top=AA^+,\\; (A^+A)^\\top=A^+A",
        "\\text{Si } A \\text{ invertible: } A^+ = A^{-1}; \\quad \\text{si rango completo col.: } A^+ = (A^\\top A)^{-1}A^\\top",
        "\\text{Si rango completo fila: } A^+ = A^\\top(AA^\\top)^{-1}; \\quad \\|A^+\\|_2 = 1/\\sigma_{\\min}(A)",
      ],
    },
    intuition: "La inversa exacta es la 'memoria perfecta': dada la salida $A\\mathbf{x} = \\mathbf{b}$, $A^{-1}$ recupera $\\mathbf{x}$ sin error. Pero la mayoría de transformaciones reales no son invertibles — colapsan dimensiones, son rectangulares o están mal condicionadas. La pseudoinversa es la 'mejor respuesta posible': si el sistema no tiene solución, $A^+\\mathbf{b}$ minimiza el residuo; si tiene infinitas soluciones, elige la de menor norma. Es como preguntar '¿cuál es el input más económico que explica mejor este output?'",
    development: [
      {
        label: "Inversa: existencia, cálculo y condicionamiento",
        body: "Para $A \\in \\mathbb{R}^{n\\times n}$, la inversa $A^{-1}$ existe $\\iff \\det(A) \\neq 0 \\iff \\text{rank}(A) = n$. La fórmula explícita via **adjunta** es:\n\n$$A^{-1} = \\frac{1}{\\det(A)}\\text{adj}(A), \\quad \\text{adj}(A)_{ij} = (-1)^{i+j}M_{ji}$$\n\nprácticamente inútil para $n > 3$; en la práctica se usa eliminación gaussiana o factorización LU en $\\mathcal{O}(n^3)$.\n\nEl **número de condición** $\\kappa(A) = \\|A\\|\\|A^{-1}\\| = \\sigma_{\\max}/\\sigma_{\\min}$ mide la sensibilidad numérica: si $\\kappa(A) \\sim 10^k$, se pierden $k$ dígitos de precisión al resolver $A\\mathbf{x}=\\mathbf{b}$. Una matriz con $\\kappa \\gg 1$ está **mal condicionada** — casi singular aunque $\\det(A)\\neq 0$."
      },
      {
        label: "Pseudoinversa vía SVD: construcción e interpretación",
        body: "Dada la SVD completa $A = U\\Sigma V^\\top$ con $U \\in \\mathbb{R}^{m\\times m}$, $\\Sigma \\in \\mathbb{R}^{m\\times n}$, $V \\in \\mathbb{R}^{n\\times n}$ y valores singulares $\\sigma_1 \\geq \\cdots \\geq \\sigma_r > 0 = \\sigma_{r+1} = \\cdots$, la pseudoinversa es:\n\n$$A^+ = V\\Sigma^+ U^\\top$$\n\ndonde $\\Sigma^+$ invierte solo los valores singulares no nulos. Interpretativamente:\n- $V^\\top$: descompone $\\mathbf{b}$ en el sistema de coordenadas de $A$\n- $\\Sigma^+$: invierte el escalado (solo en las direcciones activas)\n- $U$: regresa al espacio original\n\nEn las $n-r$ direcciones del kernel de $A$, $\\Sigma^+$ pone cero — garantizando que $\\hat{\\mathbf{x}} = A^+\\mathbf{b}$ tiene componente nula en $\\ker(A)$, lo que minimiza $\\|\\hat{\\mathbf{x}}\\|_2$."
      },
      {
        label: "Los cuatro casos de $A\\mathbf{x} = \\mathbf{b}$ y la pseudoinversa",
        body: "La pseudoinversa unifica los cuatro casos posibles de un sistema lineal:\n\n**1. $A$ cuadrada e invertible** ($m=n$, rango $n$): solución única $\\hat{\\mathbf{x}} = A^{-1}\\mathbf{b} = A^+\\mathbf{b}$.\n\n**2. Sobredeterminado** ($m > n$, rango $n$): sin solución exacta en general; $\\hat{\\mathbf{x}} = (A^\\top A)^{-1}A^\\top\\mathbf{b} = A^+\\mathbf{b}$ minimiza $\\|A\\mathbf{x}-\\mathbf{b}\\|_2^2$. Es la solución de mínimos cuadrados — regresión lineal.\n\n**3. Subdeterminado** ($m < n$, rango $m$): infinitas soluciones; $\\hat{\\mathbf{x}} = A^\\top(AA^\\top)^{-1}\\mathbf{b} = A^+\\mathbf{b}$ minimiza $\\|\\mathbf{x}\\|_2$ entre todas las soluciones exactas.\n\n**4. Rango deficiente**: combinación de los anteriores — $A^+\\mathbf{b}$ minimiza $\\|A\\mathbf{x}-\\mathbf{b}\\|_2$ y entre todos los minimizadores elige el de menor $\\|\\mathbf{x}\\|_2$.\n\nEn todos los casos, la pseudoinversa da la solución óptima en el sentido $L^2$ de mínima norma."
      },
      {
        label: "Pseudoinversa regularizada y conexión con Ridge",
        body: "En la práctica, los valores singulares pequeños en $\\Sigma^+$ producen inestabilidad numérica: $1/\\sigma_r$ puede ser enorme si $\\sigma_r \\approx 0$. La **pseudoinversa de Tikhonov** regulariza:\n\n$$A^+_{\\lambda} = V\\Sigma^+_{\\lambda}U^\\top, \\quad (\\Sigma^+_{\\lambda})_{ii} = \\frac{\\sigma_i}{\\sigma_i^2 + \\lambda}$$\n\nEsta es exactamente la **regresión Ridge**: $(A^\\top A + \\lambda I)^{-1}A^\\top = V\\Sigma^+_{\\lambda}U^\\top$. Para $\\lambda \\to 0$ recuperamos $A^+$; para $\\lambda \\to \\infty$ la solución tiende a $\\mathbf{0}$ (máxima regularización).\n\nEl filtro $\\sigma_i/(\\sigma_i^2+\\lambda)$ atenúa las componentes con $\\sigma_i \\ll \\sqrt{\\lambda}$ (ruido) y preserva aquellas con $\\sigma_i \\gg \\sqrt{\\lambda}$ (señal), interpolando suavemente entre ignorar y invertir cada dirección."
      },
      {
        label: "En Machine Learning",
        body: "La pseudoinversa subyace a:\n\n**Regresión lineal**: $\\hat{\\boldsymbol{\\beta}} = X^+\\mathbf{y} = (X^\\top X)^{-1}X^\\top\\mathbf{y}$ cuando $X$ tiene rango completo. Numéricamente se computa via QR o SVD, nunca invirtiendo $X^\\top X$ directamente.\n\n**Inicialización de redes neuronales**: métodos como LSUV y pseudoinversa-based init calculan $W^+$ para establecer la ganancia inicial en cada capa.\n\n**Teoría de interpolación** (Neural Tangent Kernel): en el régimen sobreparametrizado, las redes neuronales entrenadas con GD convergen a la solución de mínima norma $\\hat{\\boldsymbol{\\theta}} = \\Phi^+\\mathbf{y}$ donde $\\Phi$ es la matriz del kernel, análoga a la pseudoinversa.\n\n**Atención y proyección**: en cada cabeza de atención, la proyección de valores $V = XW_V$ puede interpretarse como una transformación lineal cuya pseudoinversa caracteriza la reconstrucción óptima. En **RLHF y alignment**, las actualizaciones del modelo con KL-constraint producen soluciones que se asemejan a mínima-norma en el espacio de parámetros."
      },
    ],
    code: `import numpy as np
from numpy.linalg import svd, pinv, inv, cond, norm

# ── 1. Inversa clásica y número de condición ───────────────────────────────
A = np.array([[3., 1., 0.],
              [1., 4., 2.],
              [0., 2., 5.]], dtype=float)

A_inv = inv(A)
print("A⁻¹ =\\n", A_inv.round(4))
print(f"A·A⁻¹ = I: {np.allclose(A @ A_inv, np.eye(3))}")
print(f"Número de condición κ(A) = {cond(A):.4f}")

# Matriz mal condicionada
eps = 1e-10
A_bad = np.array([[1., 1.], [1., 1.+eps]])
print(f"\\nMatriz mal condicionada κ = {cond(A_bad):.2e}")
print(f"det(A_bad) = {np.linalg.det(A_bad):.2e}")

# ── 2. Pseudoinversa vía SVD (manual) ──────────────────────────────────────
def pseudoinversa_svd(A: np.ndarray, tol: float = 1e-10) -> np.ndarray:
    """
    A⁺ = V Σ⁺ Uᵀ
    Σ⁺: invierte singulares > tol, cero para el resto.
    """
    U, S, Vt = svd(A, full_matrices=False)
    S_inv = np.where(S > tol, 1.0 / S, 0.0)
    return Vt.T @ np.diag(S_inv) @ U.T

# Verificar contra numpy
A_rect = np.array([[1., 2., 3.],
                   [4., 5., 6.]], dtype=float)   # (2×3): subdeterminado

A_plus_manual = pseudoinversa_svd(A_rect)
A_plus_numpy  = pinv(A_rect)
print(f"\\nA⁺ manual vs numpy coinciden: {np.allclose(A_plus_manual, A_plus_numpy)}")
print(f"A⁺ shape: {A_plus_numpy.shape}")   # (3×2)

# Verificar las 4 ecuaciones de Moore-Penrose
Ap = A_plus_numpy
print("\\nEcuaciones de Moore-Penrose:")
print(f"  A A⁺ A = A:       {np.allclose(A_rect @ Ap @ A_rect, A_rect)}")
print(f"  A⁺ A A⁺ = A⁺:    {np.allclose(Ap @ A_rect @ Ap, Ap)}")
print(f"  (A A⁺)ᵀ = A A⁺:  {np.allclose((A_rect@Ap).T, A_rect@Ap)}")
print(f"  (A⁺ A)ᵀ = A⁺ A:  {np.allclose((Ap@A_rect).T, Ap@A_rect)}")

# ── 3. Los cuatro casos de Ax = b ──────────────────────────────────────────
rng = np.random.default_rng(42)

# Caso 2: sobredeterminado (m > n) — mínimos cuadrados
A_over = rng.standard_normal((10, 3))
b_over = rng.standard_normal(10)
x_ls   = pinv(A_over) @ b_over
residuo = norm(A_over @ x_ls - b_over)
print(f"\\nCaso sobredeterminado (10×3):")
print(f"  ‖Ax-b‖ (mínimos cuadrados) = {residuo:.6f}")
print(f"  ‖x‖ = {norm(x_ls):.6f}")

# Caso 3: subdeterminado (m < n) — mínima norma
A_sub = rng.standard_normal((3, 10))
b_sub = rng.standard_normal(3)
x_mn  = pinv(A_sub) @ b_sub
print(f"\\nCaso subdeterminado (3×10):")
print(f"  ‖Ax-b‖ = {norm(A_sub @ x_mn - b_sub):.2e}  (solución exacta)")
print(f"  ‖x‖ mínima norma = {norm(x_mn):.6f}")

# Comprobar que cualquier otra solución tiene mayor norma
x_particular = A_sub.T @ inv(A_sub @ A_sub.T) @ b_sub  # misma sol
print(f"  Misma sol: {np.allclose(x_mn, x_particular)}")

# ── 4. Pseudoinversa regularizada (Tikhonov / Ridge) ──────────────────────
def pseudoinversa_ridge(A: np.ndarray, lam: float) -> np.ndarray:
    """
    A⁺_λ = V diag(σᵢ/(σᵢ²+λ)) Uᵀ
    Equivale a (AᵀA + λI)⁻¹Aᵀ para sistemas sobredeterminados.
    """
    U, S, Vt = svd(A, full_matrices=False)
    S_reg = S / (S**2 + lam)
    return Vt.T @ np.diag(S_reg) @ U.T

# Comparar soluciones para distintos λ
A_ill = np.array([[1., 1.000001], [1., 1.]])   # casi singular
b_ill = np.array([2., 2.])

print("\\nEfecto regularización en sistema casi singular:")
for lam in [0.0, 1e-6, 1e-3, 0.1, 1.0]:
    if lam == 0.0:
        x = pinv(A_ill) @ b_ill
    else:
        x = pseudoinversa_ridge(A_ill, lam) @ b_ill
    print(f"  λ={lam:.0e}: x={x.round(4)}, ‖x‖={norm(x):.2f}")

# ── 5. Regresión lineal = pseudoinversa ────────────────────────────────────
# y = Xβ + ε,  β̂ = X⁺y = (XᵀX)⁻¹Xᵀy
x_data = np.linspace(0, 5, 30)
y_true = 2.0*x_data + 1.5
y_data = y_true + rng.standard_normal(30) * 0.8

X_des = np.column_stack([np.ones(30), x_data])   # (30,2)
beta_pinv  = pinv(X_des) @ y_data
beta_lstsq = np.linalg.lstsq(X_des, y_data, rcond=None)[0]
print(f"\\nRegresión — β̂ (pinv):  {beta_pinv.round(4)}")
print(f"Regresión — β̂ (lstsq): {beta_lstsq.round(4)}")
print(f"Residuo: {norm(X_des@beta_pinv - y_data):.4f}")`,
    related: ["Determinante y Rango", "Descomposición SVD", "Mínimos Cuadrados", "Regularización Ridge", "Transformación Lineal"],
    hasViz: true,
    vizType: "pseudoinverse",
  },
  {
    id: 28,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Sistemas de Ecuaciones Lineales",
    tags: ["álgebra lineal", "sistemas lineales", "eliminación gaussiana", "consistencia", "rango", "mínimos cuadrados"],
    definition: "Un sistema de ecuaciones lineales es un conjunto de $m$ ecuaciones en $n$ incógnitas que puede escribirse matricialmente como $A\\mathbf{x} = \\mathbf{b}$, con $A \\in \\mathbb{R}^{m \\times n}$, $\\mathbf{x} \\in \\mathbb{R}^n$ y $\\mathbf{b} \\in \\mathbb{R}^m$. El número, existencia y unicidad de soluciones están completamente determinados por la relación entre $\\text{rank}(A)$ y $\\text{rank}([A|\\mathbf{b}])$, sintetizada en el Teorema de Rouché-Frobenius. Resolver sistemas lineales es la operación computacional más fundamental en álgebra numérica.",
    formal: {
      notation: "Sea $A \\in \\mathbb{R}^{m \\times n}$, $\\mathbf{x} \\in \\mathbb{R}^n$, $\\mathbf{b} \\in \\mathbb{R}^m$",
      body: "A\\mathbf{x} = \\mathbf{b} \\text{ tiene solución} \\iff \\mathbf{b} \\in \\text{Col}(A) \\iff \\text{rank}(A) = \\text{rank}([A|\\mathbf{b}]) \\\\[10pt] \\text{Solución general: } \\mathbf{x} = \\hat{\\mathbf{x}}_p + \\mathbf{x}_h, \\quad \\mathbf{x}_h \\in \\ker(A)",
      geometric: "\\ker(A) = \\{\\mathbf{x} \\in \\mathbb{R}^n : A\\mathbf{x} = \\mathbf{0}\\}, \\quad \\dim(\\ker(A)) = n - \\text{rank}(A)",
      properties: [
        "\\text{Sin solución: } \\text{rank}(A) < \\text{rank}([A|\\mathbf{b}]) \\quad (\\mathbf{b} \\notin \\text{Col}(A))",
        "\\text{Solución única: } \\text{rank}(A) = \\text{rank}([A|\\mathbf{b}]) = n \\quad (\\ker(A) = \\{\\mathbf{0}\\})",
        "\\text{Infinitas soluciones: } \\text{rank}(A) = \\text{rank}([A|\\mathbf{b}]) < n \\quad (\\dim(\\ker(A)) = n - \\text{rank}(A) \\geq 1)",
      ],
    },
    intuition: "Un sistema $A\\mathbf{x} = \\mathbf{b}$ pregunta: '¿puede $\\mathbf{b}$ expresarse como combinación lineal de las columnas de $A$?' Si la respuesta es no, el sistema es incompatible. Si sí, la solución existe; y si hay columnas redundantes (linealmente dependientes), hay infinitas maneras de combinarlas para obtener $\\mathbf{b}$ — infinitas soluciones. Geométricamente en $\\mathbb{R}^2$: dos ecuaciones son dos rectas; se pueden cruzar en un punto (única solución), ser paralelas (sin solución) o coincidir (infinitas soluciones).",
    development: [
      {
        label: "Teorema de Rouché-Frobenius y clasificación",
        body: "El **Teorema de Rouché-Frobenius** clasifica completamente los sistemas $A\\mathbf{x}=\\mathbf{b}$:\n\nSea $r = \\text{rank}(A)$ y $r' = \\text{rank}([A|\\mathbf{b}])$:\n\n- Si $r < r'$: **sistema incompatible** (sin solución). $\\mathbf{b}$ no está en el espacio columna de $A$.\n- Si $r = r' = n$: **sistema compatible determinado** (solución única). Kernel trivial.\n- Si $r = r' < n$: **sistema compatible indeterminado** (infinitas soluciones). El espacio de soluciones es un subespacio afín de dimensión $n - r$.\n\nLa solución general en el caso compatible se expresa como $\\mathbf{x} = \\mathbf{x}_p + \\ker(A)$, donde $\\mathbf{x}_p$ es cualquier solución particular y $\\ker(A)$ es el espacio nulo."
      },
      {
        label: "Eliminación Gaussiana y factorización LU",
        body: "La **eliminación gaussiana** transforma $A$ en forma escalonada reducida (RREF) mediante operaciones elementales de fila: (1) intercambio de filas, (2) escalado de fila, (3) suma de múltiplo de fila a otra. Estas operaciones equivalen a premultiplicar por matrices elementales invertibles, preservando el conjunto de soluciones.\n\nLa **factorización LU** (con pivoteo $PA = LU$) descompone $A$ en:\n- $P$: matriz de permutación\n- $L$: triangular inferior con $l_{ii}=1$\n- $U$: triangular superior\n\nResolver $A\\mathbf{x}=\\mathbf{b}$ se reduce entonces a dos sistemas triangulares $\\mathcal{O}(n^2)$ cada uno:\n\n$$L\\mathbf{y} = P\\mathbf{b} \\quad (\\text{sustitución hacia adelante})$$\n$$U\\mathbf{x} = \\mathbf{y} \\quad (\\text{sustitución hacia atrás})$$\n\nEl coste total es $\\mathcal{O}(n^3)$ para la factorización y $\\mathcal{O}(n^2)$ para cada resolución posterior."
      },
      {
        label: "Condicionamiento y estabilidad numérica",
        body: "Un sistema $A\\mathbf{x}=\\mathbf{b}$ está **mal condicionado** cuando pequeñas perturbaciones en $\\mathbf{b}$ o $A$ producen grandes cambios en $\\mathbf{x}$. El análisis de perturbaciones da:\n\n$$\\frac{\\|\\delta\\mathbf{x}\\|}{\\|\\mathbf{x}\\|} \\leq \\kappa(A) \\frac{\\|\\delta\\mathbf{b}\\|}{\\|\\mathbf{b}\\|}$$\n\ndonde $\\kappa(A) = \\|A\\|\\|A^{-1}\\| = \\sigma_{\\max}/\\sigma_{\\min}$ es el **número de condición**. Si $\\kappa(A) \\sim 10^k$, se pierden aproximadamente $k$ dígitos significativos en la solución.\n\nPrincipios de estabilidad numérica:\n- Usar **pivoteo parcial** (mayor elemento en columna) en eliminación gaussiana\n- Para sistemas sobredeterminados, preferir **factorización QR** sobre ecuaciones normales $(A^\\top A)^{-1}A^\\top$, ya que $\\kappa(A^\\top A) = \\kappa(A)^2$\n- Para sistemas mal condicionados: regularización de Tikhonov, SVD truncada"
      },
      {
        label: "Sistemas sobredeterminados e indeterminados en ML",
        body: "Los sistemas lineales en ML rara vez son cuadrados e invertibles. Los dos casos más comunes son:\n\n**Sobredeterminado** ($m \\gg n$, más ecuaciones que incógnitas): aparece en regresión donde $m$ muestras definen ecuaciones y $n$ parámetros son incógnitas. La solución de mínimos cuadrados $\\hat{\\mathbf{x}} = (A^\\top A)^{-1}A^\\top \\mathbf{b}$ minimiza $\\|A\\mathbf{x}-\\mathbf{b}\\|_2^2$ y equivale a proyectar $\\mathbf{b}$ sobre $\\text{Col}(A)$. Las **ecuaciones normales** $A^\\top A \\hat{\\mathbf{x}} = A^\\top \\mathbf{b}$ siempre tienen solución.\n\n**Sobreparametrizado** ($n \\gg m$, más incógnitas que ecuaciones): régimen moderno de LLMs y redes neuronales anchas. El sistema tiene infinitas soluciones exactas; el descenso de gradiente converge a la de **mínima norma** $\\hat{\\mathbf{x}} = A^\\top(AA^\\top)^{-1}\\mathbf{b}$ bajo ciertas condiciones de inicialización. Esto conecta con la **teoría de interpolación** y el **benign overfitting** en alta dimensión."
      },
      {
        label: "En Machine Learning",
        body: "Los sistemas lineales son el núcleo computacional de:\n\n**Propagación hacia atrás**: en cada capa, el cálculo de gradientes implica resolver sistemas de la forma $W\\boldsymbol{\\delta} = \\mathbf{g}$ implícitamente mediante multiplicación por $W^\\top$.\n\n**Procesos Gaussianos**: la predicción requiere resolver $(K + \\sigma^2 I)\\boldsymbol{\\alpha} = \\mathbf{y}$, donde $K$ es la matriz de kernel. El coste $\\mathcal{O}(n^3)$ es el cuello de botella que motiva aproximaciones sparse e inductivas.\n\n**Atención lineal**: variantes de atención que evitan $\\mathcal{O}(n^2)$ reformulan $\\text{softmax}(QK^\\top)V$ como un sistema lineal aproximado, explotando la estructura de bajo rango de la matriz de atención.\n\n**Optimizadores de segundo orden** (Newton, L-BFGS): cada paso resuelve $H\\boldsymbol{\\Delta\\theta} = -\\nabla\\mathcal{L}$ donde $H$ es la Hessiana. Para redes neuronales, $H \\in \\mathbb{R}^{p\\times p}$ con $p \\sim 10^9$ hace esto intractable directamente — motivando aproximaciones diagonales (Adam), Kronecker-factored (K-FAC) y métodos de Hessiana libre."
      },
    ],
    code: `import numpy as np
from numpy.linalg import matrix_rank, solve, lstsq, cond
from scipy.linalg import lu

# ── 1. Clasificación por Rouché-Frobenius ──────────────────────────────────
def clasificar_sistema(A: np.ndarray, b: np.ndarray) -> str:
    """
    Clasifica Ax=b según el Teorema de Rouché-Frobenius.
    """
    Ab = np.column_stack([A, b])
    r  = matrix_rank(A)
    r_ = matrix_rank(Ab)
    n  = A.shape[1]
    if r < r_:
        return f"Incompatible (sin solución): rank(A)={r} < rank([A|b])={r_}"
    elif r == n:
        return f"Compatible determinado (solución única): rank={r}=n={n}"
    else:
        return f"Compatible indeterminado (∞ soluciones): rank={r}<n={n}, dim ker={n-r}"

# Tres casos canónicos en R^2
casos = [
    ("Sin solución",          np.array([[1.,2.],[2.,4.]]),    np.array([1.,3.])),
    ("Solución única",        np.array([[2.,1.],[1.,3.]]),    np.array([5.,8.])),
    ("Infinitas soluciones",  np.array([[1.,2.],[2.,4.]]),    np.array([3.,6.])),
]
for nombre, A, b in casos:
    print(f"{nombre}:")
    print(f"  {clasificar_sistema(A, b)}\\n")

# ── 2. Eliminación Gaussiana (implementación didáctica) ────────────────────
def eliminacion_gaussiana(A: np.ndarray, b: np.ndarray,
                          verbose: bool = False) -> np.ndarray | None:
    """
    Resuelve Ax=b por eliminación gaussiana con pivoteo parcial.
    Devuelve x si el sistema es compatible determinado, None si singular.
    """
    n = len(b)
    M = np.column_stack([A.astype(float), b.astype(float)])

    for col in range(n):
        # Pivoteo parcial: fila con mayor |elemento| en columna actual
        pivot_row = col + np.argmax(np.abs(M[col:, col]))
        M[[col, pivot_row]] = M[[pivot_row, col]]

        if np.abs(M[col, col]) < 1e-12:
            return None   # singular

        # Eliminación
        for row in range(col+1, n):
            factor = M[row, col] / M[col, col]
            M[row, col:] -= factor * M[col, col:]
            if verbose:
                print(f"  Eliminar fila {row} usando fila {col}, factor={factor:.4f}")

    # Sustitución hacia atrás
    x = np.zeros(n)
    for i in range(n-1, -1, -1):
        x[i] = (M[i, -1] - M[i, i+1:n] @ x[i+1:n]) / M[i, i]
    return x

A_sq = np.array([[2., 1., -1.],
                 [-3.,-1.,  2.],
                 [-2., 1.,  2.]])
b_sq = np.array([8., -11., -3.])

x_gauss = eliminacion_gaussiana(A_sq, b_sq, verbose=True)
x_numpy  = solve(A_sq, b_sq)
print(f"\\nSolución Gaussiana: {x_gauss.round(4)}")
print(f"Solución numpy:     {x_numpy.round(4)}")
print(f"Verificación Ax=b:  {np.allclose(A_sq @ x_gauss, b_sq)}")

# ── 3. Factorización LU ────────────────────────────────────────────────────
P_lu, L_lu, U_lu = lu(A_sq)
print(f"\\nLU: PA=LU verificado: {np.allclose(P_lu @ A_sq, L_lu @ U_lu)}")

# Resolver con LU: Ly=Pb, Ux=y
y_lu = np.linalg.solve(L_lu, P_lu @ b_sq)
x_lu = np.linalg.solve(U_lu, y_lu)
print(f"Solución LU: {x_lu.round(4)}")

# ── 4. Sistema sobredeterminado (mínimos cuadrados) ────────────────────────
rng = np.random.default_rng(42)
m, n = 50, 3
A_over = rng.standard_normal((m, n))
b_over = A_over @ np.array([1., -2., 0.5]) + 0.3*rng.standard_normal(m)

# Método 1: ecuaciones normales (menos estable)
ATA = A_over.T @ A_over
ATb = A_over.T @ b_over
x_normal = solve(ATA, ATb)

# Método 2: lstsq (via SVD, más estable)
x_lstsq, residual, rank, sv = lstsq(A_over, b_over, rcond=None)

print(f"\\nSistema sobredeterminado ({m}×{n}):")
print(f"  κ(A):     {cond(A_over):.2f}")
print(f"  κ(AᵀA):  {cond(ATA):.2f}  (= κ(A)²)")
print(f"  x (normal eq): {x_normal.round(4)}")
print(f"  x (lstsq):     {x_lstsq.round(4)}")
print(f"  ‖Ax-b‖:  {np.linalg.norm(A_over@x_lstsq-b_over):.4f}")

# ── 5. Sistema sobreparametrizado (mínima norma) ───────────────────────────
m2, n2 = 5, 20   # n >> m: infinitas soluciones
A_sub = rng.standard_normal((m2, n2))
b_sub = rng.standard_normal(m2)

# Mínima norma: x = Aᵀ(AAᵀ)⁻¹b
ATA2 = A_sub @ A_sub.T
x_mn  = A_sub.T @ solve(ATA2, b_sub)

# Pseudoinversa (equivalente)
x_pinv = np.linalg.pinv(A_sub) @ b_sub

print(f"\\nSistema sobreparametrizado ({m2}×{n2}):")
print(f"  ‖x_mn - x_pinv‖ = {np.linalg.norm(x_mn - x_pinv):.2e}")
print(f"  ‖Ax - b‖ = {np.linalg.norm(A_sub@x_mn - b_sub):.2e}  (solución exacta)")
print(f"  ‖x_mn‖ = {np.linalg.norm(x_mn):.4f}  (mínima norma)")

# Cualquier otra solución tiene mayor norma
x_other = x_mn + rng.standard_normal(n2)*0.1
# proyectar para que también sea solución
x_other = x_other - A_sub.T @ solve(ATA2, A_sub @ x_other - b_sub)
print(f"  ‖x_other‖ = {np.linalg.norm(x_other):.4f}  (> ‖x_mn‖ ✓)")

# ── 6. Número de condición y estabilidad ───────────────────────────────────
print("\\nEfecto del condicionamiento:")
for kappa_target in [1, 10, 1e4, 1e8]:
    U_, _, Vt_ = np.linalg.svd(rng.standard_normal((4,4)))
    s_vals = np.array([kappa_target, kappa_target/2, 2, 1])
    A_cond = U_ @ np.diag(s_vals) @ Vt_
    x_true = np.ones(4)
    b_true = A_cond @ x_true
    b_pert = b_true + 1e-6 * rng.standard_normal(4)   # perturbación pequeña
    x_pert = solve(A_cond, b_pert)
    err_rel = np.linalg.norm(x_pert - x_true) / np.linalg.norm(x_true)
    print(f"  κ≈{kappa_target:.0e}: error relativo en x = {err_rel:.2e}")`,
    related: ["Determinante y Rango", "Inversa y Pseudoinversa", "Transformación Lineal", "Mínimos Cuadrados", "Eigenvalores y Eigenvectores"],
    hasViz: true,
    vizType: "linearSystems",
  },
  {
    id: 31, section: "Álgebra Lineal", sectionCode: "II",
    name: "Eigenvalores y Eigenvectores",
    tags: ["matrices", "espectral"],
    definition: "Un eigenvector de $A$ es un vector no nulo que la transformación $A$ solo escala (no rota). El factor de escala es el eigenvalor correspondiente. La estructura espectral revela el comportamiento fundamental de la transformación.",
    formal: {
      notation: "Sea $A \\in \\mathbb{R}^{n\\times n}$",
      body: "A\\mathbf{v} = \\lambda\\mathbf{v}, \\quad \\mathbf{v} \\neq \\mathbf{0}, \\quad \\lambda \\in \\mathbb{C}",
      geometric: "\\det(A - \\lambda I) = 0 \\quad \\text{(polinomio característico de grado } n\\text{)}",
      properties: [
        "\\text{tr}(A) = \\sum_i \\lambda_i, \\quad \\det(A) = \\prod_i \\lambda_i",
        "\\text{Matrices simétricas: eigenvalores reales, eigenvectores ortogonales}",
        "A = Q\\Lambda Q^\\top \\text{ (descomposición espectral, si } A \\text{ simétrica)}",
        "\\rho(A) = \\max_i |\\lambda_i| \\text{ (radio espectral)}",
      ],
    },
    intuition: "Imagina que $A$ es una deformación del espacio. Los eigenvectores son las 'líneas especiales' que se estiran o comprimen pero no cambian de dirección. Los eigenvalores dicen cuánto se estiran. Son los ejes naturales de la transformación.",
    development: [
      { label: "Cálculo del espectro", body: "Polinomio característico: $p(\\lambda) = \\det(A-\\lambda I) = 0$. Para $n$ grande, impracticable. En la práctica: algoritmos iterativos (QR iteration, power method).\n\nPower method: $\\mathbf{v}^{(k+1)} = A\\mathbf{v}^{(k)}/\\|A\\mathbf{v}^{(k)}\\|$ converge al eigenvector con mayor $|\\lambda|$." },
      { label: "Matrices simétricas (Teorema espectral)", body: "Si $A = A^\\top$ (real): todos los $\\lambda_i \\in \\mathbb{R}$, eigenvectores ortogonales. $$A = Q\\Lambda Q^\\top = \\sum_{i=1}^n \\lambda_i \\mathbf{q}_i\\mathbf{q}_i^\\top$$ Descomposición en matrices de rango 1. Covarianzas son simétricas SPD ($\\lambda_i > 0$)." },
      { label: "Eigenvalores en ML", body: "PCA: eigenvectores de $X^\\top X$ (o covarianza) dan las direcciones de máxima varianza. Los eigenvalores son las varianzas en cada componente.\n\nPageRank: eigenvector dominante de la matriz de transición de Markov.\n\nCondicional number $\\kappa(A) = \\lambda_{\\max}/\\lambda_{\\min}$: mide estabilidad numérica. Gradiente converge lento si $\\kappa \\gg 1$." },
    ],
    code: `import numpy as np

A = np.array([[4., 2.], [1., 3.]])

# Eigendescomposición
eigenvalues, eigenvectors = np.linalg.eig(A)
print(f"λ = {eigenvalues}")
print(f"V = {eigenvectors}")

# Verificar Av = λv
for i in range(len(eigenvalues)):
    lam, v = eigenvalues[i], eigenvectors[:, i]
    print(f"||Av - λv|| = {np.linalg.norm(A@v - lam*v):.2e}")

# Matrices simétricas: usar eigh (más estable)
S = np.array([[3., 1.], [1., 2.]])
lams, Q = np.linalg.eigh(S)   # garantiza λ reales
print(f"Reconstrucción: {np.allclose(Q @ np.diag(lams) @ Q.T, S)}")

# Número de condición
print(f"κ(S) = {np.linalg.cond(S):.3f}")`,
    related: ["Diagonalización", "SVD", "PCA", "Matriz simétrica"],
    hasViz: false,
  },
  {
    id: 32, section: "Álgebra Lineal", sectionCode: "II",
    name: "Diagonalización de Matrices",
    tags: ["matrices", "espectral"],
    definition: "Una matriz $A$ es diagonalizable si puede escribirse como $A = PDP^{-1}$ donde $D$ es diagonal (eigenvalores) y $P$ contiene los eigenvectores. Simplifica potencias y funciones de matrices.",
    formal: {
      notation: "Sea $A \\in \\mathbb{R}^{n\\times n}$ con $n$ eigenvectores LI",
      body: "A = PDP^{-1}, \\quad D = \\text{diag}(\\lambda_1,\\ldots,\\lambda_n), \\quad P = [\\mathbf{v}_1|\\cdots|\\mathbf{v}_n]",
      geometric: "A^k = PD^kP^{-1}, \\quad D^k = \\text{diag}(\\lambda_1^k,\\ldots,\\lambda_n^k)",
      properties: [
        "A \\text{ diagonalizable} \\iff n \\text{ eigenvectores LI}",
        "\\text{Matrices simétricas siempre diagonalizables (ortogonalmente)}",
        "e^A = Pe^DP^{-1}, \\quad e^D = \\text{diag}(e^{\\lambda_1},\\ldots,e^{\\lambda_n})",
        "\\text{Matrices con eigenvalores distintos siempre diagonalizables}",
      ],
    },
    intuition: "Diagonalizar es cambiar de base a la del sistema propio de $A$: en esa base, $A$ solo escala cada eje. Es como ver la transformación en sus 'coordenadas naturales' donde todo se simplifica enormemente.",
    development: [
      { label: "Potencias de matrices", body: "Sin diagonalizar: $A^k$ requiere $k-1$ multiplicaciones matriciales $O(n^3)$ cada una.\n\nCon diagonalización: $A^k = PD^kP^{-1}$ — solo elevar escalares a la $k$.\n\nAplicación: cadenas de Markov, sistemas dinámicos discretos $\\mathbf{x}_{t+1}=A\\mathbf{x}_t$, donde $\\mathbf{x}_t = A^t\\mathbf{x}_0 = PD^tP^{-1}\\mathbf{x}_0$." },
      { label: "Exponencial de matriz", body: "$$e^{tA} = Pe^{tD}P^{-1} = P\\,\\text{diag}(e^{t\\lambda_i})\\,P^{-1}$$ Solución de EDO $\\dot{\\mathbf{x}} = A\\mathbf{x}$ es $\\mathbf{x}(t) = e^{tA}\\mathbf{x}_0$. Estabilidad: el sistema es estable iff $\\text{Re}(\\lambda_i) < 0 \\;\\forall i$." },
      { label: "Cuándo no es diagonalizable", body: "Matrices defectivas: eigenvalor repetido con espacio propio de menor dimensión. Ejemplo: $\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ tiene $\\lambda=1$ (doble) pero solo un eigenvector.\n\nAlternativa: forma de Jordan $A = PJP^{-1}$ donde $J$ es casi diagonal." },
    ],
    code: `import numpy as np

A = np.array([[4., 1.], [2., 3.]])
lams, P = np.linalg.eig(A)
D = np.diag(lams)
P_inv = np.linalg.inv(P)

# Verificar A = P D P⁻¹
print(np.allclose(A, P @ D @ P_inv))  # True

# Potencias: A^10
k = 10
A_k_diag = P @ np.diag(lams**k) @ P_inv
A_k_brute = np.linalg.matrix_power(A, k)
print(np.allclose(A_k_diag, A_k_brute))  # True

# Exponencial de matriz
from scipy.linalg import expm
t = 0.5
eAt = P @ np.diag(np.exp(t * lams)) @ P_inv
print(np.allclose(eAt, expm(t * A)))  # True`,
    related: ["Eigenvalores", "SVD", "Cadenas de Markov", "Formas cuadráticas"],
    hasViz: false,
  },
  {
    id: 29,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Eliminación Gaussiana",
    tags: ["álgebra lineal", "eliminación gaussiana", "factorización LU", "pivoteo", "sistemas lineales", "álgebra numérica"],
    definition: "La eliminación gaussiana es el algoritmo canónico para resolver sistemas lineales $A\\mathbf{x}=\\mathbf{b}$, calcular determinantes e invertir matrices. Transforma la matriz aumentada $[A|\\mathbf{b}]$ en forma escalonada (row echelon form) mediante operaciones elementales de fila que preservan el conjunto de soluciones. Con sustitución hacia atrás, se obtiene la solución en $\\mathcal{O}(n^3)$ operaciones aritméticas. Su versión estabilizada con pivoteo parcial es el caballo de batalla de la álgebra lineal numérica.",
    formal: {
      notation: "Sea $A \\in \\mathbb{R}^{n \\times n}$ y la matriz aumentada $[A|\\mathbf{b}] \\in \\mathbb{R}^{n \\times (n+1)}$",
      body: "\\text{Eliminación: } a_{ij}^{(k+1)} = a_{ij}^{(k)} - \\frac{a_{ik}^{(k)}}{a_{kk}^{(k)}} a_{kj}^{(k)}, \\quad i > k,\\ j \\geq k \\\\[10pt] \\text{Multiplicador: } m_{ik} = \\frac{a_{ik}^{(k)}}{a_{kk}^{(k)}}, \\quad a_{kk}^{(k)} \\neq 0 \\text{ (pivote)}",
      geometric: "PA = LU, \\quad L = \\begin{pmatrix}1&&\\\\m_{21}&1&\\\\m_{31}&m_{32}&1\\end{pmatrix}, \\quad U = \\begin{pmatrix}u_{11}&u_{12}&u_{13}\\\\&u_{22}&u_{23}\\\\&&u_{33}\\end{pmatrix}",
      properties: [
        "\\text{Coste: } \\frac{2n^3}{3} + \\mathcal{O}(n^2) \\text{ flops para factorización; } 2n^2 \\text{ para sustitución}",
        "\\text{Pivoteo parcial: intercambiar fila con } \\max_{i \\geq k}|a_{ik}^{(k)}|, \\text{ garantiza } |m_{ik}| \\leq 1",
        "\\det(A) = (-1)^s \\prod_{k=1}^n u_{kk}, \\quad s = \\text{número de intercambios de filas}",
      ],
    },
    intuition: "La eliminación gaussiana es la generalización del método de sustitución escolar a $n$ dimensiones. En cada paso, se toma una ecuación (la del pivote) y se usa para eliminar una incógnita del resto de ecuaciones — exactamente como al despejar $x$ en la primera ecuación y sustituir en las demás. Al terminar, la matriz tiene forma de escalera triangular: la última ecuación tiene una sola incógnita, la penúltima dos, y así sucesivamente. La sustitución hacia atrás recorre la escalera de abajo arriba.",
    development: [
      {
        label: "El algoritmo: tres operaciones elementales de fila",
        body: "Toda la eliminación gaussiana se construye sobre tres **operaciones elementales de fila** (ERO), cada una representable como premultiplicación por una matriz invertible:\n\n1. $R_i \\leftrightarrow R_j$ (intercambio): representada por una matriz de permutación $P_{ij}$ con $\\det = -1$.\n2. $R_i \\leftarrow \\alpha R_i$ (escalado, $\\alpha \\neq 0$): matriz diagonal con $\\alpha$ en posición $i$.\n3. $R_i \\leftarrow R_i - m R_j$ (eliminación): matriz identidad con $-m$ en posición $(i,j)$.\n\nLa operación fundamental de eliminación (tipo 3) en el paso $k$:\n\n$$a_{ij}^{(k+1)} = a_{ij}^{(k)} - \\underbrace{\\frac{a_{ik}^{(k)}}{a_{kk}^{(k)}}}_{m_{ik}} a_{kj}^{(k)}, \\quad i = k+1,\\ldots,n, \\quad j = k,\\ldots,n+1$$\n\nAl final de los $n-1$ pasos de eliminación, la matriz está en forma escalonada superior (REF), y la solución se obtiene por **sustitución hacia atrás**."
      },
      {
        label: "Factorización LU y por qué es superior a resolver directamente",
        body: "La eliminación gaussiana produce implícitamente la **factorización LU**: $A = LU$ donde $L$ es triangular inferior con $l_{ii}=1$ y entradas $l_{ij} = m_{ij}$ (los multiplicadores), y $U$ es la forma escalonada resultante.\n\nLa ventaja crucial aparece cuando hay **múltiples lados derechos** $\\mathbf{b}_1, \\mathbf{b}_2, \\ldots$: la factorización $A = LU$ se computa una vez en $\\mathcal{O}(n^3)$, y cada sistema $A\\mathbf{x}_k = \\mathbf{b}_k$ se resuelve en $\\mathcal{O}(n^2)$:\n\n$$L\\mathbf{y}_k = \\mathbf{b}_k \\quad \\text{(sustitución hacia adelante)}$$\n$$U\\mathbf{x}_k = \\mathbf{y}_k \\quad \\text{(sustitución hacia atrás)}$$\n\nEsto es esencial en, por ejemplo, inversión de matrices ($n$ lados derechos = columnas de $I$), o entrenamiento con validación cruzada donde se resuelve el mismo sistema con diferentes $\\mathbf{b}$."
      },
      {
        label: "Pivoteo: necesidad y tipos",
        body: "Sin pivoteo, la eliminación gaussiana falla si el pivote $a_{kk}^{(k)} = 0$, y es numéricamente inestable si es muy pequeño. Existen tres estrategias:\n\n**Pivoteo parcial** (estándar): en el paso $k$, intercambiar la fila $k$ con la fila $i^* = \\arg\\max_{i\\geq k}|a_{ik}^{(k)}|$. Garantiza $|m_{ik}| \\leq 1$, controlando la amplificación de errores de redondeo. Produce $PA = LU$ con $\\|L\\|_\\infty \\leq 1$.\n\n**Pivoteo completo**: busca el máximo en toda la submatriz restante — más estable pero $\\mathcal{O}(n^3)$ adicional para la búsqueda, raramente necesario en la práctica.\n\n**Sin pivoteo**: válido para matrices **definidas positivas** (SPD) donde la estabilidad está garantizada por la estructura. La factorización de **Cholesky** $A = LL^\\top$ explota la simetría, costando la mitad: $\\frac{n^3}{3}$ flops."
      },
      {
        label: "Análisis de coste y formas escalonadas",
        body: "El coste de la eliminación gaussiana:\n\n- **Fase de eliminación**: en el paso $k$, se actualizan $(n-k)^2$ entradas. Total:\n\n$$\\sum_{k=1}^{n-1}(n-k)^2 \\approx \\frac{n^3}{3} \\text{ multiplicaciones} + \\frac{n^3}{3} \\text{ sumas} = \\frac{2n^3}{3} \\text{ flops}$$\n\n- **Sustitución hacia atrás**: $\\sum_{k=1}^n k = \\frac{n(n+1)}{2} \\approx n^2$ flops.\n\nLa **forma escalonada reducida** (RREF) va un paso más allá: además de zeros bajo cada pivote, también los elimina encima, y normaliza los pivotes a 1. Requiere $\\mathcal{O}(n^3)$ adicional. En la práctica numérica se usa REF + sustitución hacia atrás (equivalente pero más eficiente)."
      },
      {
        label: "En Machine Learning",
        body: "La eliminación gaussiana y la factorización LU son el sustrato de operaciones de ML que parecen de alto nivel:\n\n**Regresión Ridge**: $(X^\\top X + \\lambda I)\\hat{\\boldsymbol{\\beta}} = X^\\top\\mathbf{y}$. La matriz del sistema es SPD, lo que permite usar **Cholesky** en vez de LU, reduciendo el coste a la mitad y garantizando estabilidad.\n\n**Procesos Gaussianos**: la predicción requiere $(K + \\sigma^2 I)^{-1}\\mathbf{y}$. En la práctica se factoriza $K + \\sigma^2 I = LL^\\top$ y se resuelven dos sistemas triangulares. El cuello de botella $\\mathcal{O}(n^3)$ en $n$ puntos de entrenamiento limita los GPs a $n \\lesssim 10^4$.\n\n**Redes neuronales — capas lineales**: el forward pass $\\mathbf{h} = W\\mathbf{x}$ es multiplicación matricial, no resolución de sistemas. Pero en **implicit layers** (DEQ, Neural ODEs), el estado de equilibrio $\\mathbf{z}^* = f(\\mathbf{z}^*, \\mathbf{x})$ se encuentra resolviendo un sistema lineal en cada forward pass.\n\n**Optimización de segundo orden**: Newton y Gauss-Newton resuelven $H\\boldsymbol{\\delta} = -\\mathbf{g}$ en cada paso. Para problemas pequeños se usa Cholesky; para problemas grandes se usan métodos iterativos (CG, LSQR) que evitan factorizar explícitamente."
      },
    ],
    code: `import numpy as np

# ── 1. Eliminación Gaussiana con pivoteo parcial (implementación completa) ──
def eliminacion_gaussiana_lu(A: np.ndarray) -> tuple:
    """
    Factorización PA = LU con pivoteo parcial.
    Devuelve (P, L, U, n_swaps) donde n_swaps sirve para det.
    Coste: O(2n³/3) flops.
    """
    n = A.shape[0]
    U = A.astype(float).copy()
    L = np.eye(n)
    P = np.eye(n)
    n_swaps = 0

    for k in range(n - 1):
        # Pivoteo parcial: fila con máximo |elemento| en columna k
        idx = k + np.argmax(np.abs(U[k:, k]))
        if idx != k:
            U[[k, idx]] = U[[idx, k]]       # intercambiar filas en U
            P[[k, idx]] = P[[idx, k]]       # reflejar en P
            if k > 0:                        # ajustar L ya construida
                L[[k, idx], :k] = L[[idx, k], :k]
            n_swaps += 1

        if np.abs(U[k, k]) < 1e-14:
            raise ValueError(f"Pivote nulo en paso {k}: matriz singular")

        # Eliminación: calcular multiplicadores y actualizar
        for i in range(k + 1, n):
            m_ik = U[i, k] / U[k, k]       # multiplicador
            L[i, k] = m_ik                  # guardar en L
            U[i, k:] -= m_ik * U[k, k:]    # eliminar

    return P, L, U, n_swaps


def resolver_lu(P, L, U, b: np.ndarray) -> np.ndarray:
    """
    Resuelve Ax=b usando la factorización PA=LU previamente calculada.
    1) Ly = Pb  (sustitución hacia adelante) — O(n²)
    2) Ux = y   (sustitución hacia atrás)    — O(n²)
    """
    n = len(b)
    Pb = P @ b

    # Sustitución hacia adelante: Ly = Pb
    y = np.zeros(n)
    for i in range(n):
        y[i] = Pb[i] - L[i, :i] @ y[:i]

    # Sustitución hacia atrás: Ux = y
    x = np.zeros(n)
    for i in range(n - 1, -1, -1):
        x[i] = (y[i] - U[i, i+1:] @ x[i+1:]) / U[i, i]

    return x


# ── 2. Verificación con sistema 4×4 ───────────────────────────────────────
A = np.array([[2.,  1., -1.,  3.],
              [-4., -2., 2., -1.],
              [1.,  3.,  2.,  2.],
              [3.,  1., -3.,  1.]], dtype=float)
b = np.array([7., -5., 9., 4.])

P, L, U, n_swaps = eliminacion_gaussiana_lu(A)

print("P =\\n", P.astype(int))
print("L =\\n", L.round(4))
print("U =\\n", U.round(4))
print(f"PA = LU verificado: {np.allclose(P @ A, L @ U)}")

x_sol = resolver_lu(P, L, U, b)
print(f"\\nSolución x = {x_sol.round(6)}")
print(f"Verificación Ax = b: {np.allclose(A @ x_sol, b)}")

# ── 3. Determinante via LU ─────────────────────────────────────────────────
# det(A) = (-1)^s * prod(diag(U))
det_lu    = (-1)**n_swaps * np.prod(np.diag(U))
det_numpy = np.linalg.det(A)
print(f"\\ndet(A) via LU:    {det_lu:.6f}")
print(f"det(A) via numpy: {det_numpy:.6f}")

# ── 4. Inversión de matriz: n lados derechos ───────────────────────────────
def invertir_lu(A: np.ndarray) -> np.ndarray:
    """
    A⁻¹ resolviendo A·[x₁|...|xₙ] = I columna a columna.
    Una sola factorización LU, n sustituciones O(n²) cada una.
    Total: O(n³) factorización + O(n³) sustituciones.
    """
    n = A.shape[0]
    P, L, U, _ = eliminacion_gaussiana_lu(A)
    A_inv = np.zeros((n, n))
    for j in range(n):
        e_j = np.eye(n)[:, j]          # j-ésima columna de I
        A_inv[:, j] = resolver_lu(P, L, U, e_j)
    return A_inv

A_inv_lu    = invertir_lu(A)
A_inv_numpy = np.linalg.inv(A)
print(f"\\nInversión via LU correcta: {np.allclose(A_inv_lu, A_inv_numpy)}")
print(f"‖A·A⁻¹ - I‖_F = {np.linalg.norm(A @ A_inv_lu - np.eye(4)):.2e}")

# ── 5. Análisis de coste: LU vs iterativo ─────────────────────────────────
import time

rng = np.random.default_rng(0)

print("\\nCoste empírico — resolver Ax=b repetidamente:")
print(f"{'n':>6} | {'LU directo':>12} | {'Factoriza+Sust':>14} | {'speedup':>8}")
print("-" * 50)

for n in [50, 100, 200, 500]:
    A_n = rng.standard_normal((n, n))
    A_n = A_n @ A_n.T + n * np.eye(n)   # SPD
    b_n = rng.standard_normal(n)
    B_n = rng.standard_normal((n, 20))  # 20 lados derechos

    # Método 1: resolver directamente 20 veces
    t0 = time.perf_counter()
    for j in range(20):
        np.linalg.solve(A_n, B_n[:, j])
    t1 = time.perf_counter()
    t_direct = t1 - t0

    # Método 2: factorizar una vez, sustituir 20 veces
    import scipy.linalg as sla
    t2 = time.perf_counter()
    lu_obj = sla.lu_factor(A_n)
    for j in range(20):
        sla.lu_solve(lu_obj, B_n[:, j])
    t3 = time.perf_counter()
    t_lu = t3 - t2

    print(f"{n:>6} | {t_direct*1000:>10.2f}ms | {t_lu*1000:>12.2f}ms | {t_direct/t_lu:>7.2f}×")

# ── 6. Cholesky para matrices SPD (mitad del coste) ───────────────────────
import scipy.linalg as sla

A_spd = rng.standard_normal((6, 6))
A_spd = A_spd @ A_spd.T + 6*np.eye(6)   # Garantizar SPD
b_spd = rng.standard_normal(6)

L_ch = sla.cholesky(A_spd, lower=True)   # A = LLᵀ
x_ch = sla.cho_solve((L_ch, True), b_spd)
x_lu_ref = np.linalg.solve(A_spd, b_spd)

print(f"\\nCholesky vs LU para SPD:")
print(f"  ‖x_chol - x_lu‖ = {np.linalg.norm(x_ch - x_lu_ref):.2e}")
print(f"  LLᵀ = A verificado: {np.allclose(L_ch @ L_ch.T, A_spd)}")`,
    related: ["Sistemas de Ecuaciones Lineales", "Determinante y Rango", "Inversa y Pseudoinversa", "Transformación Lineal", "Eigenvalores y Eigenvectores"],
    hasViz: true,
    vizType: "gaussianElimination",
  },
  {
    id: 30,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Factorización LU",
    tags: ["álgebra lineal", "factorización LU", "triangular", "pivoteo", "determinante", "álgebra numérica"],
    definition: "La factorización LU descompone una matriz cuadrada $A \\in \\mathbb{R}^{n\\times n}$ en el producto $A = LU$ de una matriz triangular inferior $L$ (con $l_{ii}=1$) y una triangular superior $U$. Con pivoteo parcial se obtiene $PA = LU$, donde $P$ es una matriz de permutación. Es la forma algebraicamente explícita de la eliminación gaussiana: $L$ almacena los multiplicadores y $U$ es la forma escalonada. Su valor principal es amortizar el coste $\\mathcal{O}(n^3)$ de la factorización cuando se resuelven múltiples sistemas con la misma matriz $A$.",
    formal: {
      notation: "Sea $A \\in \\mathbb{R}^{n \\times n}$ no singular",
      body: "PA = LU \\\\[8pt] L = \\begin{pmatrix} 1 & & & \\\\ m_{21} & 1 & & \\\\ m_{31} & m_{32} & 1 & \\\\ \\vdots & & \\ddots & 1 \\end{pmatrix}, \\quad U = \\begin{pmatrix} u_{11} & u_{12} & \\cdots & u_{1n} \\\\ & u_{22} & \\cdots & u_{2n} \\\\ & & \\ddots & \\vdots \\\\ & & & u_{nn} \\end{pmatrix}",
      geometric: "\\det(A) = (-1)^s \\prod_{i=1}^n u_{ii}, \\quad A^{-1} = U^{-1}L^{-1}P",
      properties: [
        "\\text{Existencia sin pivoteo: todos los menores principales de } A \\text{ son no nulos}",
        "\\text{Coste: } \\frac{2n^3}{3} \\text{ flops (factorización)} + \\mathcal{O}(n^2) \\text{ por cada sistema posterior}",
        "\\text{Cholesky } A=LL^\\top \\text{: variante para } A \\succ 0 \\text{ simétrica, cuesta } \\frac{n^3}{3} \\text{ flops}",
      ],
    },
    intuition: "Piensa en $LU$ como un 'recibo de trabajo' de la eliminación gaussiana. $U$ es el resultado final (la forma escalonada), y $L$ es el registro de todos los pasos intermedios — exactamente los multiplicadores usados para eliminar. Separar $A = LU$ es como descomponer una transformación compleja en dos pasos simples: primero aplicar $L$ (triangular inferior, fácil de invertir hacia adelante) y luego $U$ (triangular superior, fácil de invertir hacia atrás). La clave: si necesitas resolver $A\\mathbf{x} = \\mathbf{b}$ para muchos $\\mathbf{b}$ distintos, calculas $LU$ una sola vez y luego cada solución cuesta solo $\\mathcal{O}(n^2)$.",
    development: [
      {
        label: "Construcción de L y U: dónde viven los multiplicadores",
        body: "En la eliminación gaussiana, el multiplicador $m_{ik} = a_{ik}^{(k)}/a_{kk}^{(k)}$ es el factor por el cual se escala la fila pivote antes de restarla de la fila $i$. Una observación crucial: estos multiplicadores **pueden almacenarse en las posiciones que se anulan** en $U$ — exactamente los lugares sub-diagonales donde se produce la eliminación.\n\nEste insight conduce a la factorización $A = LU$ donde:\n\n$$l_{ij} = \\begin{cases} 1 & i = j \\\\ m_{ij} & i > j \\\\ 0 & i < j \\end{cases}, \\qquad u_{ij} = \\begin{cases} a_{ij}^{(j)} & i \\leq j \\\\ 0 & i > j \\end{cases}$$\n\nLa verificación $LU = A$ se demuestra observando que cada paso de eliminación equivale a premultiplicar por una **matriz de Gauss** $M_k = I - \\mathbf{m}_k \\mathbf{e}_k^\\top$, y que el producto $M_1^{-1} M_2^{-1} \\cdots M_{n-1}^{-1} = L$ por la estructura especial de las matrices de Gauss."
      },
      {
        label: "Algoritmo de Doolittle y variantes",
        body: "La **factorización de Doolittle** ($l_{ii}=1$) calcula $L$ y $U$ directamente sin realizar la eliminación explícitamente, usando las relaciones de recurrencia:\n\n**Para $U$ (fila $i$, columnas $j \\geq i$):**\n$$u_{ij} = a_{ij} - \\sum_{k=1}^{i-1} l_{ik}\\, u_{kj}$$\n\n**Para $L$ (columna $j$, filas $i > j$):**\n$$l_{ij} = \\frac{1}{u_{jj}}\\left(a_{ij} - \\sum_{k=1}^{j-1} l_{ik}\\, u_{kj}\\right)$$\n\nLa **factorización de Crout** ($u_{ii}=1$) elige el otro convenio de normalización. La **factorización de Cholesky** $A = LL^\\top$ existe y es única cuando $A$ es simétrica definida positiva, con:\n\n$$l_{ii} = \\sqrt{a_{ii} - \\sum_{k=1}^{i-1} l_{ik}^2}, \\qquad l_{ij} = \\frac{1}{l_{jj}}\\left(a_{ij} - \\sum_{k=1}^{j-1} l_{ik}\\, l_{jk}\\right), \\quad i > j$$\n\nCholesky es numéricamente superior para SPD: es automáticamente estable sin pivoteo y cuesta $\\frac{n^3}{3}$ flops."
      },
      {
        label: "Pivoteo parcial: PA = LU y estabilidad",
        body: "Sin pivoteo, la factorización LU puede fallar (pivote nulo) o ser numéricamente inestable (pivote muy pequeño amplifica errores de redondeo). El **pivoteo parcial** garantiza estabilidad controlando el crecimiento:\n\nEn cada paso $k$, se elige como pivote el elemento de mayor magnitud en la columna $k$ desde la fila $k$ hacia abajo, intercambiando filas para colocarlo en posición $(k,k)$. Esto produce:\n\n$$PA = LU$$\n\ndonde $P$ es el producto de todas las matrices de permutación usadas. Una propiedad clave del pivoteo parcial es que garantiza $|l_{ij}| \\leq 1$, lo que controla el **factor de crecimiento**:\n\n$$\\rho = \\frac{\\max_{ij} |u_{ij}|}{\\max_{ij} |a_{ij}|}$$\n\nTeóricamente $\\rho \\leq 2^{n-1}$, pero en la práctica $\\rho$ rara vez supera $n$. El **pivoteo completo** ($PAQ = LU$) es más robusto pero raramente necesario."
      },
      {
        label: "Aplicaciones: resolver, invertir y calcular det",
        body: "La factorización $PA = LU$ habilita tres operaciones fundamentales en $\\mathcal{O}(n^2)$ una vez factorizada:\n\n**Resolver $A\\mathbf{x} = \\mathbf{b}$**: $PA\\mathbf{x} = P\\mathbf{b} \\Rightarrow LU\\mathbf{x} = P\\mathbf{b}$. Primero $L\\mathbf{y} = P\\mathbf{b}$ (sustitución hacia adelante), luego $U\\mathbf{x} = \\mathbf{y}$ (sustitución hacia atrás). Coste total por sistema: $2n^2$ flops tras factorizar.\n\n**Determinante**: $\\det(A) = (-1)^s \\prod_{i=1}^n u_{ii}$ donde $s$ es el número de intercambios de filas. Solo se necesita la diagonal de $U$.\n\n**Inversión**: resolver $A X = I$ equivale a $n$ sistemas con lados derechos $\\mathbf{e}_1, \\ldots, \\mathbf{e}_n$. Con LU prefactorizada: $n$ sustituciones de $\\mathcal{O}(n^2)$ = $\\mathcal{O}(n^3)$ total. En la práctica, raramente se invierte explícitamente — se resuelven sistemas en su lugar."
      },
      {
        label: "En Machine Learning",
        body: "La factorización LU/Cholesky subyace a operaciones de ML que parecen de alto nivel:\n\n**Regresión con regularización Ridge**: las ecuaciones normales $(X^\\top X + \\lambda I)\\hat{\\boldsymbol{\\beta}} = X^\\top \\mathbf{y}$ tienen lado izquierdo SPD cuando $\\lambda > 0$. Se factoriza con Cholesky una vez en $\\mathcal{O}(n^3)$ y se reutiliza para distintos $\\lambda$ o $\\mathbf{y}$.\n\n**Procesos Gaussianos**: la predicción $\\boldsymbol{\\mu}_* = K_{*}(K + \\sigma^2 I)^{-1}\\mathbf{y}$ y la incertidumbre $\\Sigma_* = K_{**} - K_*(K+\\sigma^2 I)^{-1}K_*^\\top$ requieren Cholesky de la matriz de kernel $K + \\sigma^2 I \\in \\mathbb{R}^{n\\times n}$. El cuello de botella $\\mathcal{O}(n^3)$ limita los GPs exactos.\n\n**Optimización de segundo orden**: Newton's method resuelve $(\\nabla^2 \\mathcal{L})\\boldsymbol{\\delta} = -\\nabla\\mathcal{L}$ en cada iteración. Para Hesianas SPD (funciones convexas), Cholesky provee factorización estable. **K-FAC** (Kronecker-Factored Approximate Curvature) aproxima la Hessiana como producto de Kronecker, habilitando Cholesky eficiente en los factores pequeños.\n\n**Attention con kernel**: variantes de atención con kernels positivos (Performers, Random Features) reformulan $\\text{softmax}(QK^\\top)V \\approx \\phi(Q)\\phi(K)^\\top V$ donde $\\phi(K)^\\top V$ se puede prefactorizar — análogo al papel de LU para múltiples lados derechos."
      },
    ],
    code: `import numpy as np
import scipy.linalg as sla
import time

# ── 1. Factorización LU de Doolittle (implementación desde cero) ──────────
def lu_doolittle(A: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray, int]:
    """
    Factorización PA = LU con pivoteo parcial.
    Devuelve (P, L, U, n_swaps).
    L almacena los multiplicadores, U la forma escalonada.
    """
    n = A.shape[0]
    U = A.astype(float).copy()
    L = np.eye(n, dtype=float)
    piv = np.arange(n)           # registro de permutaciones
    n_swaps = 0

    for k in range(n - 1):
        # ── Pivoteo parcial ───────────────────────────────────────────────
        idx = k + np.argmax(np.abs(U[k:, k]))
        if idx != k:
            U[[k, idx]]       = U[[idx, k]]           # intercambiar filas U
            L[[k, idx], :k]   = L[[idx, k], :k]       # intercambiar L ya construida
            piv[[k, idx]]     = piv[[idx, k]]          # registrar permutación
            n_swaps += 1

        if np.abs(U[k, k]) < 1e-14:
            raise ValueError(f"Pivote nulo en columna {k}")

        # ── Eliminación: calcular multiplicadores y actualizar ─────────────
        for i in range(k + 1, n):
            L[i, k] = U[i, k] / U[k, k]    # multiplicador m_ik → entra en L
            U[i, k:] -= L[i, k] * U[k, k:] # eliminación en U

    # Construir P desde el registro de permutaciones
    P = np.eye(n)[piv]
    return P, L, U, n_swaps


# ── 2. Resolución de sistemas via LU ──────────────────────────────────────
def sustitucion_adelante(L: np.ndarray, b: np.ndarray) -> np.ndarray:
    """Resuelve Ly = b con L triangular inferior (l_ii = 1). O(n²)."""
    n = len(b)
    y = np.zeros(n)
    for i in range(n):
        y[i] = b[i] - L[i, :i] @ y[:i]
    return y

def sustitucion_atras(U: np.ndarray, y: np.ndarray) -> np.ndarray:
    """Resuelve Ux = y con U triangular superior. O(n²)."""
    n = len(y)
    x = np.zeros(n)
    for i in range(n - 1, -1, -1):
        x[i] = (y[i] - U[i, i+1:] @ x[i+1:]) / U[i, i]
    return x

def resolver_lu(P, L, U, b):
    """Ax = b → PAx = Pb → LUx = Pb. Dos sustituciones O(n²)."""
    y = sustitucion_adelante(L, P @ b)
    return sustitucion_atras(U, y)


# ── 3. Verificación con sistema 4×4 ───────────────────────────────────────
A = np.array([[2.,  1., -1.,  0.],
              [4.,  3.,  1.,  2.],
              [-2., 1.,  5.,  1.],
              [0.,  2.,  2.,  3.]], dtype=float)
b_vec = np.array([1., 5., 3., 7.])

P, L, U, ns = lu_doolittle(A)

print("── Factorización PA = LU ──────────────────────────────")
print(f"P =\\n{P.astype(int)}")
print(f"L =\\n{L.round(4)}")
print(f"U =\\n{U.round(4)}")
print(f"\\nPA = LU verificado: {np.allclose(P @ A, L @ U)}")
print(f"Intercambios de filas: {ns}")

x_sol  = resolver_lu(P, L, U, b_vec)
x_ref  = np.linalg.solve(A, b_vec)
print(f"\\nSolución propia:  {x_sol.round(6)}")
print(f"Solución numpy:   {x_ref.round(6)}")
print(f"Residuo ‖Ax-b‖:   {np.linalg.norm(A @ x_sol - b_vec):.2e}")

# ── 4. Determinante y multiplicadores en L ────────────────────────────────
det_lu    = (-1)**ns * np.prod(np.diag(U))
det_numpy = np.linalg.det(A)
print(f"\\ndet(A) via LU:    {det_lu:.6f}")
print(f"det(A) via numpy: {det_numpy:.6f}")
print(f"|L[i,j]| ≤ 1 (pivoteo parcial): {np.all(np.abs(L) <= 1.0 + 1e-10)}")

# ── 5. Amortización del coste: múltiples lados derechos ───────────────────
rng = np.random.default_rng(42)
n_size = 300
A_big  = rng.standard_normal((n_size, n_size))
A_big  = A_big @ A_big.T + n_size * np.eye(n_size)  # SPD para estabilidad
B_many = rng.standard_normal((n_size, 50))           # 50 lados derechos

# Método 1: np.linalg.solve (refactoriza cada vez)
t0 = time.perf_counter()
for j in range(50):
    np.linalg.solve(A_big, B_many[:, j])
t1 = time.perf_counter()

# Método 2: prefactorizar con scipy LU, resolver 50 veces en O(n²)
t2 = time.perf_counter()
lu_factor = sla.lu_factor(A_big)          # O(n³) — solo una vez
for j in range(50):
    sla.lu_solve(lu_factor, B_many[:, j]) # O(n²) cada vez
t3 = time.perf_counter()

print(f"\\n── Amortización (n={n_size}, 50 sistemas) ──")
print(f"  50× np.solve (refactoriza): {(t1-t0)*1e3:.1f} ms")
print(f"  lu_factor + 50× lu_solve:  {(t3-t2)*1e3:.1f} ms")
print(f"  Speedup: {(t1-t0)/(t3-t2):.1f}×")

# ── 6. Cholesky para matrices SPD ──────────────────────────────────────────
A_spd = A_big.copy()

t4 = time.perf_counter()
L_ch = sla.cholesky(A_spd, lower=True)          # O(n³/3)
b_ch = rng.standard_normal(n_size)
x_ch = sla.cho_solve((L_ch, True), b_ch)
t5 = time.perf_counter()

t6 = time.perf_counter()
_, L_lu_sp, U_lu_sp = sla.lu(A_spd)
x_lu_sp = np.linalg.solve(A_spd, b_ch)
t7 = time.perf_counter()

print(f"\\n── Cholesky vs LU (matriz SPD, n={n_size}) ──")
print(f"  Cholesky: {(t5-t4)*1e3:.2f} ms")
print(f"  LU:       {(t7-t6)*1e3:.2f} ms")
print(f"  Cholesky speedup: ~{(t7-t6)/(t5-t4):.1f}×  (teórico: 2×)")
print(f"  LLᵀ = A verificado: {np.allclose(L_ch @ L_ch.T, A_spd)}")

# ── 7. Factor de crecimiento (estabilidad numérica) ───────────────────────
print("\\n── Factor de crecimiento ρ = max|u_ij| / max|a_ij| ──")
for nombre, M in [
    ("bien cond.",   rng.standard_normal((8,8))),
    ("Hilbert 8×8",  np.array([[1/(i+j+1) for j in range(8)] for i in range(8)])),
]:
    _, _, U_m, _ = lu_doolittle(M + 1e-3*np.eye(8) if "Hilbert" in nombre else M)
    rho = np.max(np.abs(U_m)) / (np.max(np.abs(M)) + 1e-15)
    kap = np.linalg.cond(M)
    print(f"  {nombre:15s}: ρ={rho:.2f},  κ(A)={kap:.2e}")`,
    related: ["Eliminación Gaussiana", "Sistemas de Ecuaciones Lineales", "Determinante y Rango", "Inversa y Pseudoinversa", "Descomposición SVD"],
    hasViz: true,
    vizType: "luFactorization",
  },
  {
    id: 16,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Base y Dimensión",
    tags: ["álgebra lineal", "espacio vectorial", "independencia lineal", "rango", "subespacio"],
    definition: "Una base de un espacio vectorial V es un conjunto linealmente independiente de vectores que genera (span) a V. La dimensión de V es el número de elementos de cualquier base de V, y es un invariante del espacio: todas las bases tienen la misma cardinalidad.",
    formal: {
      notation: "Sea $V$ un espacio vectorial sobre un campo $\\mathbb{F}$",
      body: "\\mathcal{B} = \\{\\mathbf{v}_1, \\mathbf{v}_2, \\ldots, \\mathbf{v}_n\\} \\subset V \\text{ es base de } V \\iff \\begin{cases} \\text{(i) L.I.: } \\sum_{i=1}^n \\alpha_i \\mathbf{v}_i = \\mathbf{0} \\Rightarrow \\alpha_i = 0 \\ \\forall i \\\\ \\text{(ii) Generador: } \\forall \\mathbf{u} \\in V,\\ \\exists\\, \\alpha_i \\in \\mathbb{F} : \\mathbf{u} = \\sum_{i=1}^n \\alpha_i \\mathbf{v}_i \\end{cases}",
      geometric: "\\dim(V) = n \\iff \\exists \\text{ base } \\mathcal{B} \\text{ con } |\\mathcal{B}| = n \\quad (\\text{toda base de } V \\text{ tiene exactamente } n \\text{ elementos})",
      properties: [
        "\\text{Unicidad de coordenadas: } \\forall \\mathbf{u} \\in V,\\ \\exists! (\\alpha_1, \\ldots, \\alpha_n) \\in \\mathbb{F}^n : \\mathbf{u} = \\sum_{i=1}^n \\alpha_i \\mathbf{v}_i",
        "\\text{Invarianza: si } \\mathcal{B},\\mathcal{B}' \\text{ son bases de } V \\Rightarrow |\\mathcal{B}| = |\\mathcal{B}'| = \\dim(V)",
        "\\text{Rango-nulidad: } \\dim(\\text{Im}(T)) + \\dim(\\ker(T)) = \\dim(V) \\text{ para } T: V \\to W \\text{ lineal}",
      ],
    },
    intuition: "Piensa en una base como el conjunto mínimo de 'ingredientes' con los que puedes reconstruir cualquier elemento del espacio, sin redundancias. En $\\mathbb{R}^2$, los vectores $\\mathbf{e}_1=(1,0)$ y $\\mathbf{e}_2=(0,1)$ son una base: con escalas y sumas alcanzas cualquier punto del plano, y ninguno de los dos es 'redundante' (no puedes obtener uno a partir del otro). La dimensión cuenta cuántos ingredientes distintos necesitas — es el grado de libertad intrínseco del espacio.",
    development: [
      {
        label: "Independencia lineal y generación",
        body: "Un conjunto $\\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_k\\}$ es **linealmente independiente** (L.I.) si la única combinación lineal que produce el vector cero es la trivial:\n\n$$\\alpha_1 \\mathbf{v}_1 + \\cdots + \\alpha_k \\mathbf{v}_k = \\mathbf{0} \\implies \\alpha_i = 0 \\ \\forall i$$\n\nEquivalentemente, ningún vector del conjunto puede escribirse como combinación lineal de los demás. El **span** o espacio generado se define como:\n\n$$\\text{span}(\\mathbf{v}_1, \\ldots, \\mathbf{v}_k) = \\left\\{ \\sum_{i=1}^k \\alpha_i \\mathbf{v}_i \\ : \\ \\alpha_i \\in \\mathbb{F} \\right\\}$$\n\nSi adicionalmente $\\text{span}(\\mathcal{B}) = V$, decimos que $\\mathcal{B}$ es un **sistema generador** de $V$. Una base es el conjunto mínimo generador, o equivalentemente el conjunto L.I. maximal."
      },
      {
        label: "Base estándar y cambio de base",
        body: "La **base canónica** de $\\mathbb{R}^n$ es $\\mathcal{E} = \\{\\mathbf{e}_1, \\ldots, \\mathbf{e}_n\\}$ donde $\\mathbf{e}_i$ tiene un $1$ en la posición $i$ y ceros en el resto. Dada otra base $\\mathcal{B} = \\{\\mathbf{b}_1, \\ldots, \\mathbf{b}_n\\}$, la **matriz de cambio de base** $P_{\\mathcal{E} \\to \\mathcal{B}}$ transforma coordenadas:\n\n$$[\\mathbf{v}]_{\\mathcal{E}} = P \\cdot [\\mathbf{v}]_{\\mathcal{B}}, \\quad P = \\begin{bmatrix} | & & | \\\\ \\mathbf{b}_1 & \\cdots & \\mathbf{b}_n \\\\ | & & | \\end{bmatrix}$$\n\nEl cambio inverso se obtiene con $P^{-1}$, que existe porque las columnas de $P$ son L.I. (forman una base). Este mecanismo es fundamental en diagonalización y en PCA."
      },
      {
        label: "Dimensión de subespacios y el Teorema del Rango",
        body: "Para una transformación lineal $T: V \\to W$ con $\\dim(V) = n$, el **Teorema Rango-Nulidad** establece:\n\n$$\\text{rank}(T) + \\text{nullity}(T) = n$$\n\ndonde $\\text{rank}(T) = \\dim(\\text{Im}(T))$ y $\\text{nullity}(T) = \\dim(\\ker(T))$.\n\nPara una matriz $A \\in \\mathbb{R}^{m \\times n}$, el **rango columna** (dimensión del espacio columna) coincide siempre con el **rango fila** (dimensión del espacio fila). Esto es un teorema no trivial: $\\text{rank}(A) = \\text{rank}(A^\\top)$. El rango determina la invertibilidad: $A$ es invertible $\\iff \\text{rank}(A) = n \\iff \\ker(A) = \\{\\mathbf{0}\\}$."
      },
      {
        label: "En Machine Learning",
        body: "La dimensión es ubicua en ML. La **maldición de la dimensionalidad** describe cómo el volumen del espacio crece exponencialmente con $\\dim$: para llenar un hipercubo $[0,1]^d$ con densidad comparable a $[0,1]^1$ se necesitan muestras del orden $\\mathcal{O}(N^d)$.\n\nEn **PCA**, se busca una base ortogonal $\\{\\mathbf{u}_1, \\ldots, \\mathbf{u}_k\\}$ con $k < d$ tal que el subespacio de dimensión $k$ maximice la varianza proyectada:\n\n$$\\mathbf{u}_i = \\arg\\max_{\\|\\mathbf{u}\\|=1,\\ \\mathbf{u} \\perp \\mathbf{u}_j\\ \\forall j<i} \\text{Var}(\\mathbf{u}^\\top X)$$\n\nLos vectores encontrados son los **eigenvectores** de la matriz de covarianza $\\Sigma$. El **rango** de una matriz de datos $X \\in \\mathbb{R}^{n \\times d}$ determina la dimensión intrínseca de los datos: si $\\text{rank}(X) = r \\ll d$, los datos yacen en un subespacio de dimensión $r$ — base del funcionamiento de **low-rank approximation** y **embeddings**."
      },
    ],
    code: `import numpy as np
from numpy.linalg import matrix_rank, svd

# ── 1. Verificar independencia lineal ──────────────────────────────────────
def es_linealmente_independiente(vectores: np.ndarray) -> bool:
    """
    Verifica si las columnas de la matriz son L.I.
    Un conjunto es L.I. <=> el rango es igual al número de vectores.
    """
    return matrix_rank(vectores) == vectores.shape[1]

# Ejemplo: base canónica de R^3
E = np.eye(3)
print("Base canónica L.I.:", es_linealmente_independiente(E))  # True

# Conjunto linealmente dependiente (tercera columna = suma de las dos primeras)
dep = np.array([[1, 0, 1],
                [0, 1, 1],
                [0, 0, 0]], dtype=float)
print("Conjunto dependiente:", es_linealmente_independiente(dep))  # False

# ── 2. Rango de una matriz ─────────────────────────────────────────────────
A = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]], dtype=float)

rango = matrix_rank(A)
print(f"Rango de A: {rango}")           # 2 — filas/columnas dependientes
print(f"Nulidad de A: {3 - rango}")     # 1 — por Teorema Rango-Nulidad

# ── 3. Encontrar una base del espacio columna (Col(A)) ─────────────────────
def base_espacio_columna(A: np.ndarray, tol: float = 1e-10):
    """Devuelve columnas de A que forman una base de Col(A) via pivotes de SVD."""
    U, S, Vt = svd(A)
    r = np.sum(S > tol)
    # Las primeras r columnas de U forman una base ortonormal de Col(A)
    return U[:, :r]

base_col = base_espacio_columna(A)
print(f"Base ortonormal del espacio columna (dim={base_col.shape[1]}):")
print(base_col.round(4))

# ── 4. Cambio de base ──────────────────────────────────────────────────────
# Base B = {(1,1), (1,-1)} normalizada de R^2
b1 = np.array([1, 1]) / np.sqrt(2)
b2 = np.array([1, -1]) / np.sqrt(2)
P = np.column_stack([b1, b2])   # Matriz de cambio de base (columnas = vectores de B)

v_std = np.array([3.0, 1.0])   # Vector en base estándar
v_B   = np.linalg.solve(P, v_std)  # Coordenadas en base B
print(f"v en base estándar: {v_std}")
print(f"v en base B:        {v_B.round(4)}")
print(f"Reconstrucción:     {P @ v_B}")  # Debe recuperar v_std

# ── 5. Dimensión intrínseca (varianza explicada) ───────────────────────────
rng = np.random.default_rng(42)
# Datos en R^10 pero concentrados en un subespacio de dimensión 3
low_rank = rng.standard_normal((200, 3)) @ rng.standard_normal((3, 10))
low_rank += 0.01 * rng.standard_normal((200, 10))  # ruido pequeño

_, S_lr, _ = svd(low_rank, full_matrices=False)
var_explicada = np.cumsum(S_lr**2) / np.sum(S_lr**2)
dim_95 = np.searchsorted(var_explicada, 0.95) + 1
print(f"Dimensión intrínseca (95% varianza): {dim_95}")  # ≈ 3`,
    related: ["Independencia Lineal", "Espacio Vectorial", "Transformación Lineal", "Descomposición SVD", "PCA"],
    hasViz: true,
    vizType: "baseDimension",
  },
  {
    id: 17,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Operaciones entre Vectores (Suma y Escalar)",
    tags: ["álgebra lineal", "vectores", "espacio vectorial", "combinación lineal", "geometría"],
    definition: "Las dos operaciones fundamentales en un espacio vectorial son la suma vectorial y el producto por escalar. La suma de dos vectores combina sus componentes entrada a entrada; el producto por escalar estira o contrae (y eventualmente invierte) un vector sin alterar su dirección. Estas dos operaciones, junto con sus ocho axiomas, definen la estructura de espacio vectorial.",
    formal: {
      notation: "Sean $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n$ y $\\alpha, \\beta \\in \\mathbb{R}$",
      body: "\\text{Suma: } (\\mathbf{u} + \\mathbf{v})_i = u_i + v_i \\quad \\forall i \\in \\{1,\\ldots,n\\} \\\\[8pt] \\text{Escalar: } (\\alpha\\,\\mathbf{v})_i = \\alpha\\, v_i \\quad \\forall i \\in \\{1,\\ldots,n\\}",
      geometric: "\\mathbf{u} + \\mathbf{v} = \\mathbf{v} + \\mathbf{u} \\quad (\\text{regla del paralelogramo}), \\qquad \\alpha(\\mathbf{u}+\\mathbf{v}) = \\alpha\\mathbf{u} + \\alpha\\mathbf{v}",
      properties: [
        "\\text{Conmutatividad: } \\mathbf{u} + \\mathbf{v} = \\mathbf{v} + \\mathbf{u}",
        "\\text{Distributividad mixta: } (\\alpha + \\beta)\\mathbf{v} = \\alpha\\mathbf{v} + \\beta\\mathbf{v}",
        "\\text{Combinación lineal: } \\sum_{i=1}^k \\alpha_i\\,\\mathbf{v}_i \\in V \\text{ (cerradura bajo ambas operaciones)}",
      ],
    },
    intuition: "Imagina que $\\mathbf{u}$ y $\\mathbf{v}$ son desplazamientos en el plano. Sumarlos equivale a recorrer primero $\\mathbf{u}$ y luego $\\mathbf{v}$ — el resultado es el diagonal del paralelogramo que forman. Multiplicar por $\\alpha = 2$ duplica la distancia recorrida en la misma dirección; $\\alpha = -1$ la invierte. Con solo estas dos operaciones, puedes alcanzar cualquier punto del espacio combinando vectores base — eso es exactamente una combinación lineal.",
    development: [
      {
        label: "Axiomas del espacio vectorial",
        body: "Las dos operaciones deben satisfacer **ocho axiomas** para que $(V, +, \\cdot)$ sea espacio vectorial sobre $\\mathbb{F}$. Para la suma: (A1) cerradura, (A2) conmutatividad, (A3) asociatividad, (A4) existencia del neutro $\\mathbf{0}$, (A5) existencia del inverso $-\\mathbf{v}$. Para el escalar: (E1) cerradura, (E2) compatibilidad $\\alpha(\\beta\\mathbf{v}) = (\\alpha\\beta)\\mathbf{v}$, (E3-E4) doble distributividad:\n\n$$(\\alpha + \\beta)\\mathbf{v} = \\alpha\\mathbf{v} + \\beta\\mathbf{v}, \\qquad \\alpha(\\mathbf{u}+\\mathbf{v}) = \\alpha\\mathbf{u}+\\alpha\\mathbf{v}$$\n\nEstos axiomas garantizan que la geometría se comporta coherentemente. Nótese que aplican no solo a $\\mathbb{R}^n$ sino a espacios de funciones, matrices, polinomios, etc."
      },
      {
        label: "Interpretación geométrica: regla del paralelogramo",
        body: "En $\\mathbb{R}^2$ y $\\mathbb{R}^3$, la suma vectorial tiene una interpretación inmediata: colocando el origen de $\\mathbf{v}$ en la punta de $\\mathbf{u}$ (método cabeza-cola), $\\mathbf{u}+\\mathbf{v}$ apunta del origen a la punta de $\\mathbf{v}$. Equivalentemente, es la **diagonal del paralelogramo** formado por $\\mathbf{u}$ y $\\mathbf{v}$.\n\nPara el escalar, $\\alpha > 1$ estira, $0 < \\alpha < 1$ contrae, $\\alpha < 0$ invierte la dirección, y $\\alpha = 0$ colapsa al origen. El conjunto $\\{\\alpha\\mathbf{v} : \\alpha \\in \\mathbb{R}\\}$ es una **recta** que pasa por el origen — el subespacio generado por un único vector."
      },
      {
        label: "Combinación lineal y subespacio generado",
        body: "Una **combinación lineal** de vectores $\\mathbf{v}_1, \\ldots, \\mathbf{v}_k$ es cualquier expresión:\n\n$$\\mathbf{w} = \\sum_{i=1}^k \\alpha_i \\mathbf{v}_i, \\quad \\alpha_i \\in \\mathbb{F}$$\n\nEl conjunto de todas las combinaciones lineales posibles forma el **span** o envoltura lineal, que es el subespacio más pequeño que contiene a todos los $\\mathbf{v}_i$. La cerradura bajo $+$ y $\\cdot$ es exactamente lo que hace que el span sea un subespacio: si $\\mathbf{w}_1, \\mathbf{w}_2 \\in \\text{span}\\{\\mathbf{v}_i\\}$, entonces $\\alpha\\mathbf{w}_1 + \\beta\\mathbf{w}_2 \\in \\text{span}\\{\\mathbf{v}_i\\}$."
      },
      {
        label: "En Machine Learning",
        body: "Estas operaciones son el tejido computacional de todo ML. El **forward pass** de una red neuronal es, en esencia, una cascada de combinaciones lineales seguidas de no-linealidades:\n\n$$\\mathbf{h}^{(l)} = \\sigma\\!\\left(W^{(l)}\\mathbf{h}^{(l-1)} + \\mathbf{b}^{(l)}\\right) = \\sigma\\!\\left(\\sum_j w^{(l)}_{ij}\\, h^{(l-1)}_j + b^{(l)}_i\\right)$$\n\nEl **descenso por gradiente** actualiza parámetros con una suma escalada: $\\boldsymbol{\\theta} \\leftarrow \\boldsymbol{\\theta} - \\eta\\,\\nabla_{\\boldsymbol{\\theta}}\\mathcal{L}$, donde $\\eta$ es el escalar (tasa de aprendizaje). Los **embeddings** son vectores cuya suma captura significado: en word2vec, $\\mathbf{v}_{\\text{rey}} - \\mathbf{v}_{\\text{hombre}} + \\mathbf{v}_{\\text{mujer}} \\approx \\mathbf{v}_{\\text{reina}}$, un ejemplo célebre de aritmética vectorial semántica."
      },
    ],
    code: `import numpy as np

# ── 1. Operaciones básicas ─────────────────────────────────────────────────
u = np.array([2.0, 1.0, -1.0])
v = np.array([1.0, 3.0,  2.0])

suma    = u + v          # Suma vectorial entrada a entrada
escalar = 2.5 * v        # Producto por escalar
resta   = u - v          # Equivalente a u + (-1)*v

print(f"u + v        = {suma}")
print(f"2.5 · v      = {escalar}")
print(f"u - v        = {resta}")

# ── 2. Verificación de axiomas ─────────────────────────────────────────────
alpha, beta = 3.0, -1.5

# Conmutatividad
assert np.allclose(u + v, v + u), "Falla conmutatividad"

# Distributividad escalar-vector
assert np.allclose((alpha + beta) * v, alpha * v + beta * v), "Falla dist. escalar"

# Distributividad escalar-suma
assert np.allclose(alpha * (u + v), alpha * u + alpha * v), "Falla dist. suma"

print("Todos los axiomas verificados ✓")

# ── 3. Combinación lineal ──────────────────────────────────────────────────
def combinacion_lineal(vectores: list[np.ndarray],
                       escalares: list[float]) -> np.ndarray:
    """
    Calcula sum_i alpha_i * v_i.
    vectores : lista de arrays de igual forma
    escalares: coeficientes correspondientes
    """
    return sum(a * v for a, v in zip(escalares, vectores))

# Expresar w como combinación de la base canónica
e1 = np.array([1., 0., 0.])
e2 = np.array([0., 1., 0.])
e3 = np.array([0., 0., 1.])
w  = np.array([4., -2., 7.])

w_reconstruido = combinacion_lineal([e1, e2, e3], [4., -2., 7.])
print(f"w reconstruido = {w_reconstruido}")   # [4. -2. 7.]
print(f"Error = {np.linalg.norm(w - w_reconstruido):.2e}")  # ~0

# ── 4. Aritmética de embeddings (word2vec style) ───────────────────────────
# Embeddings sintéticos de dimensión 4 (en la práctica, 100-1536 dims)
rng = np.random.default_rng(0)
vocab = {w: rng.standard_normal(4) for w in ["rey", "reina", "hombre", "mujer"]}

# rey - hombre + mujer ≈ reina
analogia = vocab["rey"] - vocab["hombre"] + vocab["mujer"]
cosenos = {
    w: analogia @ vocab[w] / (np.linalg.norm(analogia) * np.linalg.norm(vocab[w]))
    for w in vocab
}
print("\\nSimilitudes coseno con (rey - hombre + mujer):")
for word, sim in sorted(cosenos.items(), key=lambda x: -x[1]):
    print(f"  {word:8s}: {sim:+.4f}")
# Con embeddings reales entrenados, 'reina' obtendría la mayor similitud`,
    related: ["Espacio Vectorial", "Producto Punto", "Norma de un Vector", "Combinación Lineal", "Base y Dimensión"],
    hasViz: true,
    vizType: "vectorOps",
  },
  {
    id: 19,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Producto Cruzado",
    tags: ["álgebra lineal", "vectores", "geometría", "R3", "determinante", "normal"],
    definition: "El producto cruzado (o producto vectorial) es una operación binaria definida exclusivamente en $\\mathbb{R}^3$ que toma dos vectores y produce un tercer vector ortogonal a ambos. Su magnitud es igual al área del paralelogramo formado por los vectores originales, y su dirección sigue la regla de la mano derecha. Es antisimétrico y bilineal, pero no asociativo.",
    formal: {
      notation: "Sean $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^3$",
      body: "\\mathbf{u} \\times \\mathbf{v} = \\det\\begin{pmatrix} \\mathbf{e}_1 & \\mathbf{e}_2 & \\mathbf{e}_3 \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{pmatrix} = \\begin{pmatrix} u_2 v_3 - u_3 v_2 \\\\ u_3 v_1 - u_1 v_3 \\\\ u_1 v_2 - u_2 v_1 \\end{pmatrix}",
      geometric: "\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|\\sin\\theta, \\quad \\theta = \\angle(\\mathbf{u},\\mathbf{v}) \\in [0, \\pi]",
      properties: [
        "\\text{Antisimetría: } \\mathbf{u} \\times \\mathbf{v} = -(\\mathbf{v} \\times \\mathbf{u})",
        "\\text{Identidad de Lagrange: } \\|\\mathbf{u} \\times \\mathbf{v}\\|^2 = \\|\\mathbf{u}\\|^2\\|\\mathbf{v}\\|^2 - (\\mathbf{u}\\cdot\\mathbf{v})^2",
        "\\text{Triple escalar: } \\mathbf{u}\\cdot(\\mathbf{v}\\times\\mathbf{w}) = \\det[\\mathbf{u},\\mathbf{v},\\mathbf{w}] = \\text{Vol(paralelepípedo)}",
      ],
    },
    intuition: "Piensa en el producto cruzado como una 'brújula de perpendicularidad': dados dos vectores que definen un plano, $\\mathbf{u} \\times \\mathbf{v}$ apunta en la única dirección que es ortogonal a ese plano. La magnitud te dice cuánta área 'abarca' el par de vectores — si son paralelos ($\\sin\\theta = 0$) el área es cero; si son perpendiculares ($\\sin\\theta = 1$) el área es máxima. La regla de la mano derecha fija la orientación: dedos de $\\mathbf{u}$ hacia $\\mathbf{v}$, el pulgar señala $\\mathbf{u} \\times \\mathbf{v}$.",
    development: [
      {
        label: "Expansión por cofactores y fórmula explícita",
        body: "La definición formal vía determinante simbólico se expande por cofactores a lo largo de la primera fila:\n\n$$\\mathbf{u} \\times \\mathbf{v} = \\mathbf{e}_1(u_2v_3 - u_3v_2) - \\mathbf{e}_2(u_1v_3 - u_3v_1) + \\mathbf{e}_3(u_1v_2 - u_2v_1)$$\n\nEl signo alternado $+, -, +$ proviene de la expansión de cofactores. Una regla mnemotécnica es la **regla de Sarrus** o la disposición cíclica de índices: $(1,2,3) \\to (2,3,1) \\to (3,1,2)$, donde cada componente es la diferencia de los productos en sentido horario y antihorario:\n\n$$(\\mathbf{u}\\times\\mathbf{v})_k = u_i v_j - u_j v_i, \\quad (i,j,k) \\text{ permutación par de } (1,2,3)$$"
      },
      {
        label: "Propiedades algebraicas y no-asociatividad",
        body: "El producto cruzado es **bilineal** y **antisimétrico**, pero **no asociativo** — esto lo distingue radicalmente del producto punto:\n\n$$\\mathbf{u}\\times(\\mathbf{v}\\times\\mathbf{w}) \\neq (\\mathbf{u}\\times\\mathbf{v})\\times\\mathbf{w}$$\n\nEn cambio, satisface la **identidad de Jacobi**: $\\mathbf{u}\\times(\\mathbf{v}\\times\\mathbf{w}) + \\mathbf{v}\\times(\\mathbf{w}\\times\\mathbf{u}) + \\mathbf{w}\\times(\\mathbf{u}\\times\\mathbf{v}) = \\mathbf{0}$, que convierte a $(\\mathbb{R}^3, \\times)$ en un **álgebra de Lie**.\n\nLa **fórmula BAC-CAB** permite expandir el triple vectorial:\n\n$$\\mathbf{u}\\times(\\mathbf{v}\\times\\mathbf{w}) = \\mathbf{v}(\\mathbf{u}\\cdot\\mathbf{w}) - \\mathbf{w}(\\mathbf{u}\\cdot\\mathbf{v})$$"
      },
      {
        label: "Interpretación geométrica: área y volumen",
        body: "La magnitud $\\|\\mathbf{u}\\times\\mathbf{v}\\| = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\sin\\theta$ es exactamente el **área del paralelogramo** con lados $\\mathbf{u}$ y $\\mathbf{v}$, y por tanto la mitad del área del triángulo que forman:\n\n$$A_{\\triangle} = \\frac{1}{2}\\|\\mathbf{u}\\times\\mathbf{v}\\|$$\n\nEl **producto escalar triple** extiende esto al volumen con signo del paralelepípedo definido por tres vectores:\n\n$$V = |\\mathbf{u}\\cdot(\\mathbf{v}\\times\\mathbf{w})| = |\\det[\\mathbf{u}\\mid\\mathbf{v}\\mid\\mathbf{w}]|$$\n\nEsto conecta directamente con el determinante: $\\det A \\neq 0 \\iff$ las filas/columnas de $A$ son linealmente independientes $\\iff$ el paralelepípedo tiene volumen no nulo."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "Aunque el producto cruzado es estrictamente de $\\mathbb{R}^3$, sus ideas se generalizan ampliamente. En **geometría diferencial y redes neuronales 3D** (PointNet, NeRF, Gaussian Splatting), el producto cruzado computa **normales a superficies** a partir de dos vectores tangentes, esenciales para iluminación y shading diferenciable.\n\nEn **robótica y visión por computadora**, la representación de rotaciones mediante el **álgebra de Lie** $\\mathfrak{so}(3)$ usa la matriz antisimétrica asociada al producto cruzado:\n\n$$[\\mathbf{u}]_\\times = \\begin{pmatrix} 0 & -u_3 & u_2 \\\\ u_3 & 0 & -u_1 \\\\ -u_2 & u_1 & 0 \\end{pmatrix}, \\quad \\mathbf{u}\\times\\mathbf{v} = [\\mathbf{u}]_\\times\\,\\mathbf{v}$$\n\nEsta representación aparece en la optimización de poses de cámara (SLAM, bundle adjustment) y en **Lie group networks** que respetan simetrías geométricas."
      },
    ],
    code: `import numpy as np

# ── 1. Producto cruzado manual y verificación ──────────────────────────────
def producto_cruzado(u: np.ndarray, v: np.ndarray) -> np.ndarray:
    """
    Calcula u × v para vectores en R^3.
    Equivalente a np.cross(u, v), implementado explícitamente.
    """
    assert u.shape == v.shape == (3,), "Solo definido en R^3"
    return np.array([
        u[1]*v[2] - u[2]*v[1],   # componente x
        u[2]*v[0] - u[0]*v[2],   # componente y
        u[0]*v[1] - u[1]*v[0],   # componente z
    ])

u = np.array([1., 0., 0.])   # e1
v = np.array([0., 1., 0.])   # e2
w = producto_cruzado(u, v)
print(f"e1 × e2 = {w}")       # Debe ser e3 = [0, 0, 1]

# Verificación numérica vs. np.cross
u2 = np.array([2., 3., -1.])
v2 = np.array([1., -2.,  4.])
assert np.allclose(producto_cruzado(u2, v2), np.cross(u2, v2))
print("Concordancia con np.cross ✓")

# ── 2. Propiedades geométricas ─────────────────────────────────────────────
cross = np.cross(u2, v2)

# Ortogonalidad: u·(u×v) = 0 y v·(u×v) = 0
print(f"u·(u×v) = {u2 @ cross:.2e}")   # ~0
print(f"v·(u×v) = {v2 @ cross:.2e}")   # ~0

# Magnitud = área del paralelogramo
theta = np.arccos(np.clip(u2 @ v2 / (np.linalg.norm(u2)*np.linalg.norm(v2)), -1, 1))
area_paralelo = np.linalg.norm(u2) * np.linalg.norm(v2) * np.sin(theta)
print(f"||u×v||     = {np.linalg.norm(cross):.6f}")
print(f"||u||·||v||·sin θ = {area_paralelo:.6f}")  # Iguales

# ── 3. Área de triángulo con vértices arbitrarios ─────────────────────────
def area_triangulo(A, B, C):
    """Área del triángulo ABC en R^3 vía producto cruzado."""
    AB = B - A
    AC = C - A
    return 0.5 * np.linalg.norm(np.cross(AB, AC))

A = np.array([0., 0., 0.])
B = np.array([3., 0., 0.])
C = np.array([0., 4., 0.])
print(f"Área triángulo (3-4-5): {area_triangulo(A, B, C):.4f}")  # 6.0

# ── 4. Matriz antisimétrica [u]× (álgebra de Lie so(3)) ───────────────────
def skew_symmetric(u: np.ndarray) -> np.ndarray:
    """Devuelve la matriz antisimétrica [u]× tal que [u]×·v = u × v."""
    return np.array([
        [ 0,    -u[2],  u[1]],
        [ u[2],  0,    -u[0]],
        [-u[1],  u[0],  0   ]
    ])

u3 = np.array([1., 2., 3.])
v3 = np.array([4., 5., 6.])
U_skew = skew_symmetric(u3)

cross_direct = np.cross(u3, v3)
cross_matrix = U_skew @ v3
print(f"u×v directo  = {cross_direct}")
print(f"[u]×·v       = {cross_matrix}")   # Idéntico
print(f"Antisimetría: U + U^T = \\n{U_skew + U_skew.T}")  # Matriz cero

# ── 5. Volumen de paralelepípedo (triple escalar) ──────────────────────────
a = np.array([1., 0., 0.])
b = np.array([0., 2., 0.])
c = np.array([0., 0., 3.])
vol = abs(a @ np.cross(b, c))
print(f"Volumen paralelepípedo = {vol:.4f}")  # 6.0 = 1×2×3`,
    related: ["Producto Punto", "Determinante", "Norma de un Vector", "Transformaciones Lineales", "Álgebras de Lie"],
    hasViz: true,
    vizType: "crossProduct",
  },
  {
    id: 20,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Norma de un Vector (L1, L2, Lp, L∞)",
    tags: ["álgebra lineal", "normas", "regularización", "distancia", "optimización", "geometría"],
    definition: "Una norma es una función $\\|\\cdot\\|: V \\to \\mathbb{R}_{\\geq 0}$ que asigna a cada vector una 'longitud' no negativa, satisfaciendo tres axiomas: positividad definida, homogeneidad absoluta y desigualdad triangular. La familia $L^p$ parametriza un continuo de normas indexadas por $p \\geq 1$, interpolando entre la norma Manhattan ($p=1$), Euclidiana ($p=2$) y la norma máximo ($p \\to \\infty$).",
    formal: {
      notation: "Sea $\\mathbf{x} \\in \\mathbb{R}^n$ y $p \\in [1, \\infty]$",
      body: "\\|\\mathbf{x}\\|_p = \\left(\\sum_{i=1}^n |x_i|^p\\right)^{\\!1/p}, \\quad p \\in [1,\\infty) \\\\[10pt] \\|\\mathbf{x}\\|_\\infty = \\lim_{p\\to\\infty}\\|\\mathbf{x}\\|_p = \\max_{1 \\leq i \\leq n} |x_i|",
      geometric: "B_p = \\{\\mathbf{x} \\in \\mathbb{R}^n : \\|\\mathbf{x}\\|_p \\leq 1\\} \\quad \\text{(bola unitaria de radio 1 en norma } L^p\\text{)}",
      properties: [
        "\\text{Positividad: } \\|\\mathbf{x}\\|_p \\geq 0,\\ \\|\\mathbf{x}\\|_p = 0 \\iff \\mathbf{x} = \\mathbf{0}",
        "\\text{Homogeneidad: } \\|\\alpha\\mathbf{x}\\|_p = |\\alpha|\\,\\|\\mathbf{x}\\|_p \\quad \\forall \\alpha \\in \\mathbb{R}",
        "\\text{Desigualdad triangular: } \\|\\mathbf{x}+\\mathbf{y}\\|_p \\leq \\|\\mathbf{x}\\|_p + \\|\\mathbf{y}\\|_p \\quad (\\text{Minkowski})",
      ],
    },
    intuition: "Cada norma $L^p$ mide 'distancia' de una manera distinta. $L^1$ (Manhattan) cuenta la distancia real caminando en una cuadrícula: solo movimientos horizontales y verticales. $L^2$ (Euclidiana) es la distancia en línea recta — el vuelo del cuervo. $L^\\infty$ solo mira el movimiento más grande, ignorando los demás. La forma de la bola unitaria revela la geometría: un rombo en $L^1$, un círculo en $L^2$, un cuadrado en $L^\\infty$. Conforme $p$ crece, la bola se 'infla' de rombo hacia cuadrado.",
    development: [
      {
        label: "Las tres normas canónicas y sus fórmulas",
        body: "Para $\\mathbf{x} = (x_1, \\ldots, x_n)^\\top \\in \\mathbb{R}^n$, las tres normas más usadas en ML son:\n\n$$\\|\\mathbf{x}\\|_1 = \\sum_{i=1}^n |x_i| \\qquad \\text{(Manhattan / Taxicab)}$$\n\n$$\\|\\mathbf{x}\\|_2 = \\sqrt{\\sum_{i=1}^n x_i^2} = \\sqrt{\\mathbf{x}^\\top\\mathbf{x}} \\qquad \\text{(Euclidiana)}$$\n\n$$\\|\\mathbf{x}\\|_\\infty = \\max_i |x_i| \\qquad \\text{(Chebyshev / máximo)}$$\n\nSe cumple la cadena de desigualdades para todo $\\mathbf{x} \\in \\mathbb{R}^n$:\n\n$$\\|\\mathbf{x}\\|_\\infty \\leq \\|\\mathbf{x}\\|_2 \\leq \\|\\mathbf{x}\\|_1 \\leq \\sqrt{n}\\,\\|\\mathbf{x}\\|_2 \\leq n\\,\\|\\mathbf{x}\\|_\\infty$$"
      },
      {
        label: "Equivalencia de normas y bolas unitarias",
        body: "En $\\mathbb{R}^n$ de dimensión finita, **todas las normas son equivalentes**: para cualesquiera dos normas $\\|\\cdot\\|_a$ y $\\|\\cdot\\|_b$, existen constantes $0 < c \\leq C < \\infty$ tales que:\n\n$$c\\,\\|\\mathbf{x}\\|_a \\leq \\|\\mathbf{x}\\|_b \\leq C\\,\\|\\mathbf{x}\\|_a \\quad \\forall\\mathbf{x}$$\n\nEsto implica que inducen la misma topología (mismas sucesiones convergentes). Sin embargo, sus **geometrías difieren dramáticamente**: la bola unitaria $B_p = \\{\\mathbf{x}: \\|\\mathbf{x}\\|_p \\leq 1\\}$ tiene forma de rombo ($p=1$), disco ($p=2$) o cuadrado ($p=\\infty$) en $\\mathbb{R}^2$, y esto afecta directamente qué soluciones se favorecen en optimización.\n\nNótese que para $p < 1$ la función $\\|\\cdot\\|_p$ **no es norma** (viola la desigualdad triangular), aunque se usa en optimización sparse como cuasi-norma."
      },
      {
        label: "Norma dual y desigualdad de Hölder",
        body: "A cada norma $L^p$ le corresponde una **norma dual** $L^q$ donde $\\frac{1}{p} + \\frac{1}{q} = 1$ (con $q = \\infty$ si $p=1$ y viceversa). La **desigualdad de Hölder** generaliza Cauchy-Schwarz:\n\n$$|\\mathbf{x}^\\top\\mathbf{y}| \\leq \\|\\mathbf{x}\\|_p \\cdot \\|\\mathbf{y}\\|_q, \\quad \\frac{1}{p}+\\frac{1}{q}=1$$\n\nPara $p=q=2$ recuperamos Cauchy-Schwarz. La norma dual tiene interpretación variacional:\n\n$$\\|\\mathbf{x}\\|_p = \\max_{\\|\\mathbf{y}\\|_q \\leq 1} \\mathbf{x}^\\top\\mathbf{y}$$\n\nEsto conecta normas con **programas lineales** y **funciones de soporte** en geometría convexa."
      },
      {
        label: "En Machine Learning / Regularización",
        body: "La elección de norma en regularización determina la **estructura de la solución**. Dado un problema de minimización $\\min_{\\boldsymbol{\\theta}} \\mathcal{L}(\\boldsymbol{\\theta}) + \\lambda\\|\\boldsymbol{\\theta}\\|_p^p$:\n\n**Ridge** ($p=2$): $\\lambda\\|\\boldsymbol{\\theta}\\|_2^2$ penaliza pesos grandes, solución analítica $\\hat{\\boldsymbol{\\theta}} = (X^\\top X + \\lambda I)^{-1}X^\\top\\mathbf{y}$, coeficientes shrinkage pero raramente exactamente cero.\n\n**Lasso** ($p=1$): $\\lambda\\|\\boldsymbol{\\theta}\\|_1$ produce soluciones **sparse** (muchos $\\theta_i = 0$ exactamente) porque la bola $L^1$ tiene esquinas que 'atrapan' la solución en los ejes coordenados.\n\n**Elastic Net**: combinación $\\alpha\\|\\boldsymbol{\\theta}\\|_1 + (1-\\alpha)\\|\\boldsymbol{\\theta}\\|_2^2$. En **redes neuronales**, la norma $L^2$ sobre pesos equivale a **weight decay**: $\\nabla\\mathcal{L}_{\\text{reg}} = \\nabla\\mathcal{L} + 2\\lambda\\boldsymbol{\\theta}$, que contrae los pesos en cada actualización."
      },
    ],
    code: `import numpy as np
from numpy.linalg import norm

# ── 1. Normas Lp para p finito ─────────────────────────────────────────────
def norma_lp(x: np.ndarray, p: float) -> float:
    """Norma Lp generalizada. p debe ser >= 1."""
    if p == np.inf:
        return np.max(np.abs(x))
    return np.sum(np.abs(x)**p)**(1/p)

x = np.array([3.0, -4.0, 0.0, 2.0])

print(f"x = {x}")
print(f"‖x‖₁  = {norma_lp(x, 1):.4f}")    # 9.0  (3+4+0+2)
print(f"‖x‖₂  = {norma_lp(x, 2):.4f}")    # 5.385
print(f"‖x‖₃  = {norma_lp(x, 3):.4f}")    # 4.497
print(f"‖x‖∞  = {norma_lp(x, np.inf):.4f}") # 4.0

# Verificación contra numpy
assert np.isclose(norma_lp(x, 2), norm(x, 2))
assert np.isclose(norma_lp(x, 1), norm(x, 1))
assert np.isclose(norma_lp(x, np.inf), norm(x, np.inf))
print("Verificado contra numpy.linalg.norm ✓")

# ── 2. Cadena de desigualdades ─────────────────────────────────────────────
n = len(x)
l1, l2, linf = norm(x,1), norm(x,2), norm(x,np.inf)
print(f"\\n‖x‖∞ ≤ ‖x‖₂ ≤ ‖x‖₁ ≤ √n·‖x‖₂:")
print(f"  {linf:.3f} ≤ {l2:.3f} ≤ {l1:.3f} ≤ {np.sqrt(n)*l2:.3f}")
assert linf <= l2 <= l1 <= np.sqrt(n)*l2 + 1e-10

# ── 3. Desigualdad de Hölder ───────────────────────────────────────────────
y = np.array([1.0, -2.0, 3.0, -1.0])
for p, q in [(1, np.inf), (2, 2), (3, 1.5)]:
    lhs = abs(x @ y)
    rhs = norm(x, p) * norm(y, q)
    print(f"p={p}, q={q}: |x·y|={lhs:.4f} ≤ ‖x‖_p·‖y‖_q={rhs:.4f}  {'✓' if lhs <= rhs+1e-9 else '✗'}")

# ── 4. Regularización L1 vs L2 (Lasso vs Ridge simplificado) ──────────────
from numpy.linalg import lstsq

rng = np.random.default_rng(42)
n_samples, n_features = 50, 20
X = rng.standard_normal((n_samples, n_features))
# Solo 3 coeficientes son relevantes
true_w = np.zeros(n_features)
true_w[[2, 7, 15]] = [3.0, -2.5, 1.8]
y_data = X @ true_w + 0.5*rng.standard_normal(n_samples)

# Ridge analítico
lam = 1.0
w_ridge = np.linalg.solve(X.T@X + lam*np.eye(n_features), X.T@y_data)

# Lasso vía subgradiente proximal (iteraciones simples)
def lasso_proximal(X, y, lam, n_iter=500, lr=0.001):
    w = np.zeros(X.shape[1])
    for _ in range(n_iter):
        grad = -X.T @ (y - X@w) / len(y)
        w = w - lr*grad
        # Operador proximal L1: soft-thresholding
        w = np.sign(w) * np.maximum(np.abs(w) - lr*lam, 0)
    return w

w_lasso = lasso_proximal(X, y_data, lam=0.5)

print(f"\\nRidge  — coefs no cero: {np.sum(np.abs(w_ridge) > 0.01)}/{n_features}")
print(f"Lasso  — coefs no cero: {np.sum(np.abs(w_lasso) > 0.01)}/{n_features}")
print(f"Coefs detectados por Lasso (idx): {np.where(np.abs(w_lasso) > 0.01)[0]}")

# ── 5. Normalización de vectores ───────────────────────────────────────────
def normalizar(x: np.ndarray, p: float = 2) -> np.ndarray:
    """Proyecta x sobre la bola unitaria Lp."""
    n = norma_lp(x, p)
    return x / n if n > 1e-12 else x

v = np.array([3.0, 4.0])
print(f"\\nv normalizado L2: {normalizar(v, 2)}  ‖·‖₂={norm(normalizar(v,2),2):.4f}")
print(f"v normalizado L1: {normalizar(v, 1)}  ‖·‖₁={norm(normalizar(v,1),1):.4f}")`,
    related: ["Producto Punto", "Distancia y Similitud", "Regularización Ridge y Lasso", "Espacio Vectorial", "Producto Cruzado"],
    hasViz: true,
    vizType: "normBalls",
  },
  {
    id: 21,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Distancia Euclidiana",
    tags: ["álgebra lineal", "distancia", "métrica", "geometría", "similitud", "kNN"],
    definition: "La distancia euclidiana entre dos puntos $\\mathbf{x}, \\mathbf{y} \\in \\mathbb{R}^n$ es la longitud del segmento que los une, obtenida como la norma $L^2$ de su diferencia. Es el caso $p=2$ de la familia de distancias de Minkowski y constituye la noción más natural de distancia en espacios de dimensión finita, generalización directa del teorema de Pitágoras a $n$ dimensiones.",
    formal: {
      notation: "Sean $\\mathbf{x}, \\mathbf{y} \\in \\mathbb{R}^n$",
      body: "d_2(\\mathbf{x}, \\mathbf{y}) = \\|\\mathbf{x} - \\mathbf{y}\\|_2 = \\sqrt{\\sum_{i=1}^n (x_i - y_i)^2} = \\sqrt{(\\mathbf{x}-\\mathbf{y})^\\top(\\mathbf{x}-\\mathbf{y})}",
      geometric: "d_2(\\mathbf{x},\\mathbf{y})^2 = \\|\\mathbf{x}\\|_2^2 + \\|\\mathbf{y}\\|_2^2 - 2\\,\\mathbf{x}^\\top\\mathbf{y} \\quad (\\text{ley del coseno generalizada})",
      properties: [
        "\\text{No negatividad: } d_2(\\mathbf{x},\\mathbf{y}) \\geq 0,\\ d_2(\\mathbf{x},\\mathbf{y})=0 \\iff \\mathbf{x}=\\mathbf{y}",
        "\\text{Simetría: } d_2(\\mathbf{x},\\mathbf{y}) = d_2(\\mathbf{y},\\mathbf{x})",
        "\\text{Desigualdad triangular: } d_2(\\mathbf{x},\\mathbf{z}) \\leq d_2(\\mathbf{x},\\mathbf{y}) + d_2(\\mathbf{y},\\mathbf{z})",
      ],
    },
    intuition: "La distancia euclidiana es la respuesta al vuelo del cuervo: la ruta más corta posible entre dos puntos en el espacio. En $\\mathbb{R}^2$ es simplemente Pitágoras: $d = \\sqrt{\\Delta x^2 + \\Delta y^2}$. En $\\mathbb{R}^n$ acumula la discrepancia en cada dimensión elevada al cuadrado — lo que significa que diferencias grandes pesan desproporcionadamente más que diferencias pequeñas. Esta sensibilidad cuadrática la hace intuitiva en baja dimensión, pero problemática en alta dimensión donde todas las distancias convergen.",
    development: [
      {
        label: "Derivación desde Pitágoras y generalización",
        body: "En $\\mathbb{R}^2$, el teorema de Pitágoras da la longitud de la hipotenusa: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$. La generalización a $\\mathbb{R}^3$ añade un término: $d = \\sqrt{\\Delta x^2 + \\Delta y^2 + \\Delta z^2}$, aplicando Pitágoras dos veces. En $\\mathbb{R}^n$ la extensión es directa:\n\n$$d_2(\\mathbf{x},\\mathbf{y}) = \\sqrt{\\sum_{i=1}^n (x_i - y_i)^2}$$\n\nLa **ley del coseno generalizada** permite descomponer el cuadrado de la distancia en normas individuales más un término de interacción:\n\n$$d_2(\\mathbf{x},\\mathbf{y})^2 = \\|\\mathbf{x}\\|^2 + \\|\\mathbf{y}\\|^2 - 2\\mathbf{x}^\\top\\mathbf{y}$$\n\nEsta identidad conecta distancia, norma y producto punto, y es la base de muchos algoritmos de ML."
      },
      {
        label: "Axiomas de métrica y espacio métrico",
        body: "Una función $d: X \\times X \\to \\mathbb{R}_{\\geq 0}$ es una **métrica** si satisface cuatro axiomas:\n\n1. $d(x,y) \\geq 0$ y $d(x,y)=0 \\iff x=y$ (positividad)\n2. $d(x,y) = d(y,x)$ (simetría)\n3. $d(x,z) \\leq d(x,y) + d(y,z)$ (triangular)\n\nLa distancia euclidiana satisface los tres. El par $(\\mathbb{R}^n, d_2)$ es un **espacio métrico completo** (espacio de Hilbert de dimensión finita). La desigualdad triangular tiene una versión inversa útil:\n\n$$|d(x,z) - d(y,z)| \\leq d(x,y)$$\n\nque garantiza que la función distancia es **Lipschitz continua** con constante 1 en cada argumento."
      },
      {
        label: "Maldición de la dimensionalidad y concentración",
        body: "En alta dimensión, la distancia euclidiana pierde poder discriminativo. Para puntos uniformes en $[0,1]^d$, la distancia al vecino más cercano y al más lejano satisfacen:\n\n$$\\frac{d_{\\max} - d_{\\min}}{d_{\\min}} \\to 0 \\quad \\text{cuando } d \\to \\infty$$\n\nEste fenómeno de **concentración de la medida** implica que todas las distancias son aproximadamente iguales para $d$ grande. Más precisamente, para $\\mathbf{x} \\sim \\mathcal{N}(\\mathbf{0}, I_d)$:\n\n$$\\frac{\\|\\mathbf{x}\\|_2}{\\sqrt{d}} \\xrightarrow{p} 1 \\quad (d \\to \\infty)$$\n\nEs decir, los puntos gaussianos se concentran en la superficie de una esfera de radio $\\sqrt{d}$. En la práctica esto motiva el uso de **reducción de dimensionalidad** (PCA, UMAP) antes de aplicar métricas euclidianas."
      },
      {
        label: "En Machine Learning",
        body: "La distancia euclidiana es el corazón de decenas de algoritmos:\n\n**k-NN**: clasifica $\\mathbf{x}$ según las $k$ muestras de entrenamiento con menor $d_2(\\mathbf{x}, \\mathbf{x}_i)$. Su complejidad $\\mathcal{O}(nd)$ por consulta motiva estructuras como KD-trees y ball trees.\n\n**K-Means**: asigna cada punto al centroide más cercano en $L^2$ y actualiza centroides como medias. El paso de asignación minimiza $\\sum_k \\sum_{\\mathbf{x}\\in C_k} d_2(\\mathbf{x}, \\boldsymbol{\\mu}_k)^2$.\n\n**Distancia de Mahalanobis**: corrige la isotropía euclidiana usando la covarianza de los datos:\n\n$$d_M(\\mathbf{x},\\mathbf{y}) = \\sqrt{(\\mathbf{x}-\\mathbf{y})^\\top \\Sigma^{-1} (\\mathbf{x}-\\mathbf{y})}$$\n\nEs invariante a transformaciones lineales y equivale a $d_2$ en el espacio blanqueado $\\Sigma^{-1/2}\\mathbf{x}$. En **redes siamesas** y **metric learning**, el objetivo de entrenamiento es aprender una métrica $d_\\theta$ tal que puntos similares estén cerca y disímiles lejos."
      },
    ],
    code: `import numpy as np
from numpy.linalg import norm

# ── 1. Distancia euclidiana: implementaciones ──────────────────────────────
def dist_euclidiana(x: np.ndarray, y: np.ndarray) -> float:
    """d₂(x,y) = ‖x - y‖₂. Equivalente a np.linalg.norm(x-y)."""
    return np.sqrt(np.sum((x - y)**2))

x = np.array([1.0, 2.0, 3.0])
y = np.array([4.0, 0.0, -1.0])

d_manual = dist_euclidiana(x, y)
d_numpy  = norm(x - y)
d_ley_coseno = np.sqrt(norm(x)**2 + norm(y)**2 - 2*(x @ y))

print(f"d₂(x,y) manual      = {d_manual:.6f}")
print(f"d₂(x,y) numpy       = {d_numpy:.6f}")
print(f"d₂(x,y) ley coseno  = {d_ley_coseno:.6f}")
assert np.allclose(d_manual, d_numpy, d_ley_coseno)

# ── 2. Matriz de distancias (todos contra todos) ───────────────────────────
def matriz_distancias(X: np.ndarray) -> np.ndarray:
    """
    Calcula D donde D[i,j] = d₂(xᵢ, xⱼ) para X ∈ ℝ^{n×d}.
    Usa la identidad: ‖xᵢ-xⱼ‖² = ‖xᵢ‖² + ‖xⱼ‖² - 2 xᵢ·xⱼ
    Vectorizado: O(n²d) pero sin bucles Python.
    """
    normas_sq = np.sum(X**2, axis=1, keepdims=True)  # (n,1)
    G = X @ X.T                                        # Gram matrix (n,n)
    D_sq = normas_sq + normas_sq.T - 2*G
    np.fill_diagonal(D_sq, 0)  # eliminar errores numéricos
    return np.sqrt(np.maximum(D_sq, 0))

rng = np.random.default_rng(42)
X = rng.standard_normal((5, 3))
D = matriz_distancias(X)
print(f"\\nMatriz de distancias (5 puntos en R³):")
print(D.round(4))
print(f"Simétrica: {np.allclose(D, D.T)}")  # True

# ── 3. Verificación axiomas de métrica ─────────────────────────────────────
i, j, k = 0, 1, 2
print(f"\\nAxiomas de métrica:")
print(f"  No negatividad:    d(x,y) = {D[i,j]:.4f} ≥ 0  ✓")
print(f"  Simetría:          d(i,j)={D[i,j]:.4f} == d(j,i)={D[j,i]:.4f}  ✓")
print(f"  Triangular:        d(i,k)={D[i,k]:.4f} ≤ d(i,j)+d(j,k)={D[i,j]+D[j,k]:.4f}  ✓")

# ── 4. Concentración en alta dimensión ────────────────────────────────────
print("\\nConcentración de la medida (N=2000 puntos gaussianos):")
for d_dim in [2, 10, 50, 200, 1000]:
    pts = rng.standard_normal((2000, d_dim))
    D_mat = matriz_distancias(pts)
    np.fill_diagonal(D_mat, np.inf)
    d_min = D_mat.min(axis=1).mean()
    np.fill_diagonal(D_mat, 0)
    d_max = D_mat.max(axis=1).mean()
    contraste = (d_max - d_min) / d_min
    radio_teorico = np.sqrt(d_dim)  # concentración en esfera √d
    print(f"  d={d_dim:4d}: d_min={d_min:.2f}, d_max={d_max:.2f}, "
          f"contraste={contraste:.3f}, ‖x‖≈{radio_teorico:.1f}")

# ── 5. Distancia de Mahalanobis ────────────────────────────────────────────
def dist_mahalanobis(x: np.ndarray, y: np.ndarray,
                     Sigma: np.ndarray) -> float:
    """d_M(x,y) = √[(x-y)ᵀ Σ⁻¹ (x-y)]. Invariante a escalado."""
    diff = x - y
    Sigma_inv = np.linalg.inv(Sigma)
    return np.sqrt(diff @ Sigma_inv @ diff)

# Datos con correlación fuerte entre dim 0 y 1
Sigma = np.array([[4.0, 3.5, 0.0],
                  [3.5, 4.0, 0.0],
                  [0.0, 0.0, 1.0]])
a = np.array([2.0, 2.0, 0.0])
b = np.array([0.0, 0.0, 0.0])

print(f"\\nd₂(a,b)  = {norm(a-b):.4f}  (ignora correlación)")
print(f"d_M(a,b) = {dist_mahalanobis(a, b, Sigma):.4f}  (corrige por Σ)")
# a y b están correlacionados → Mahalanobis < Euclidiana`,
    related: ["Norma de un Vector", "Producto Punto", "Similitud Coseno", "K-Means", "k-NN"],
    hasViz: true,
    vizType: "euclideanDistance",
  },
  {
    id: 22,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Similitud Coseno",
    tags: ["álgebra lineal", "similitud", "producto punto", "embeddings", "NLP", "recuperación de información"],
    definition: "La similitud coseno entre dos vectores no nulos $\\mathbf{x}, \\mathbf{y} \\in \\mathbb{R}^n$ es el coseno del ángulo que forman, obtenido normalizando su producto punto por el producto de sus normas $L^2$. Toma valores en $[-1, 1]$: $1$ indica vectores paralelos con igual orientación, $0$ indica ortogonalidad, y $-1$ indica antiparalelismo. A diferencia de la distancia euclidiana, es invariante a la magnitud de los vectores y mide exclusivamente su orientación relativa.",
    formal: {
      notation: "Sean $\\mathbf{x}, \\mathbf{y} \\in \\mathbb{R}^n \\setminus \\{\\mathbf{0}\\}$",
      body: "\\text{sim}_{\\cos}(\\mathbf{x},\\mathbf{y}) = \\cos\\theta = \\frac{\\mathbf{x}^\\top\\mathbf{y}}{\\|\\mathbf{x}\\|_2\\,\\|\\mathbf{y}\\|_2} = \\frac{\\sum_{i=1}^n x_i y_i}{\\sqrt{\\sum_{i=1}^n x_i^2}\\,\\sqrt{\\sum_{i=1}^n y_i^2}}",
      geometric: "\\text{sim}_{\\cos}(\\mathbf{x},\\mathbf{y}) = \\hat{\\mathbf{x}}^\\top\\hat{\\mathbf{y}}, \\quad \\hat{\\mathbf{x}} = \\frac{\\mathbf{x}}{\\|\\mathbf{x}\\|_2} \\quad (\\text{producto punto de versores})",
      properties: [
        "\\text{Rango: } \\text{sim}_{\\cos} \\in [-1,1], \\text{ con } {=}1 \\iff \\mathbf{y}=\\alpha\\mathbf{x},\\ \\alpha>0",
        "\\text{Invarianza de escala: } \\text{sim}_{\\cos}(\\alpha\\mathbf{x}, \\beta\\mathbf{y}) = \\text{sgn}(\\alpha\\beta)\\,\\text{sim}_{\\cos}(\\mathbf{x},\\mathbf{y}),\\ \\alpha,\\beta\\neq 0",
        "\\text{Distancia coseno: } d_{\\cos}(\\mathbf{x},\\mathbf{y}) = 1 - \\text{sim}_{\\cos}(\\mathbf{x},\\mathbf{y}) \\in [0,2]",
      ],
    },
    intuition: "Imagina dos flechas saliendo del origen: la similitud coseno solo mira hacia dónde apuntan, no qué tan largas son. Un documento con 1000 palabras y otro con 10, si hablan del mismo tema, apuntan en la misma dirección y tendrán similitud coseno $\\approx 1$, aunque su distancia euclidiana sea enorme. Es como comparar dos personas por su orientación en el espacio, no por su altura. En NLP, cada palabra o documento es un vector de frecuencias; el coseno captura similitud semántica independientemente del volumen del texto.",
    development: [
      {
        label: "Derivación desde el producto punto",
        body: "El **producto punto** satisface la identidad geométrica $\\mathbf{x}^\\top\\mathbf{y} = \\|\\mathbf{x}\\|\\|\\mathbf{y}\\|\\cos\\theta$, donde $\\theta \\in [0,\\pi]$ es el ángulo entre los vectores. Despejando:\n\n$$\\cos\\theta = \\frac{\\mathbf{x}^\\top\\mathbf{y}}{\\|\\mathbf{x}\\|\\|\\mathbf{y}\\|}$$\n\nEsta expresión normaliza el producto punto dividiéndolo por las magnitudes, obteniendo una cantidad adimensional en $[-1,1]$. Geométricamente equivale a proyectar ambos vectores sobre la esfera unitaria $S^{n-1}$ y calcular su producto punto como versores $\\hat{\\mathbf{x}}^\\top\\hat{\\mathbf{y}}$.\n\nLa **desigualdad de Cauchy-Schwarz** garantiza que el cociente es válido y acotado:\n\n$$|\\mathbf{x}^\\top\\mathbf{y}| \\leq \\|\\mathbf{x}\\|\\|\\mathbf{y}\\| \\implies \\cos\\theta \\in [-1,1]$$"
      },
      {
        label: "Relación con distancia euclidiana y correlación de Pearson",
        body: "Para vectores **normalizados** $\\hat{\\mathbf{x}}, \\hat{\\mathbf{y}} \\in S^{n-1}$, la distancia euclidiana al cuadrado y la similitud coseno se relacionan por:\n\n$$\\|\\hat{\\mathbf{x}} - \\hat{\\mathbf{y}}\\|_2^2 = 2(1 - \\cos\\theta) = 2\\,d_{\\cos}(\\mathbf{x},\\mathbf{y})$$\n\nEsto implica que en vectores ya normalizados, **ordenar por similitud coseno es equivalente a ordenar por distancia euclidiana**. Esta equivalencia es explotada en sistemas de búsqueda aproximada (ANN) como FAISS, que usa distancias euclidianas internamente con vectores pre-normalizados.\n\nLa **correlación de Pearson** es la similitud coseno aplicada a vectores centrados. Si $\\tilde{\\mathbf{x}} = \\mathbf{x} - \\bar{x}\\mathbf{1}$:\n\n$$r_{xy} = \\text{sim}_{\\cos}(\\tilde{\\mathbf{x}}, \\tilde{\\mathbf{y}}) = \\frac{\\tilde{\\mathbf{x}}^\\top\\tilde{\\mathbf{y}}}{\\|\\tilde{\\mathbf{x}}\\|\\|\\tilde{\\mathbf{y}}\\|}$$"
      },
      {
        label: "No es métrica y distancia coseno",
        body: "La similitud coseno **no es una métrica**: no satisface la desigualdad triangular en general. Sin embargo, la **distancia coseno** $d_{\\cos} = 1 - \\text{sim}_{\\cos} \\in [0,2]$ tampoco es una métrica estricta (viola triangular en casos degenerados).\n\nEn cambio, la **distancia angular** sí es métrica:\n\n$$d_{\\text{ang}}(\\mathbf{x},\\mathbf{y}) = \\frac{\\arccos(\\text{sim}_{\\cos}(\\mathbf{x},\\mathbf{y}))}{\\pi} \\in [0,1]$$\n\nEsta distinción importa en práctica: HNSW y otros índices ANN asumen que la función de distancia satisface la desigualdad triangular para podar el grafo de búsqueda eficientemente. Usar $1 - \\cos\\theta$ directamente puede producir resultados subóptimos en estos índices."
      },
      {
        label: "En Machine Learning / NLP y Embeddings",
        body: "La similitud coseno es la métrica estándar en **recuperación de información** y **embeddings semánticos**:\n\n**TF-IDF y Bag-of-Words**: documentos representados como vectores de frecuencias en un vocabulario de dimensión $|V| \\sim 10^4{-}10^6$. El coseno captura similitud temática neutralizando la longitud del documento.\n\n**Word y sentence embeddings**: en espacios de embeddings densos ($d \\sim 768{-}4096$), el coseno mide similitud semántica. El sistema de búsqueda semántica más simple es:\n\n$$\\text{top-}k = \\underset{i}{\\text{arg top-}k}\\; \\frac{\\mathbf{q}^\\top\\mathbf{e}_i}{\\|\\mathbf{q}\\|\\|\\mathbf{e}_i\\|}$$\n\n**Atención en Transformers**: el mecanismo de atención $\\text{softmax}(QK^\\top/\\sqrt{d_k})V$ computa similitudes entre queries y keys; el factor $1/\\sqrt{d_k}$ escala el producto punto para mantener varianza constante, evitando que el softmax sature en zonas de gradiente cero. Es una similitud coseno aproximada (sin normalización por norma, pero con regularización estadística).\n\n**Contrastive learning** (SimCLR, CLIP): el objetivo entrena embeddings para maximizar $\\text{sim}_{\\cos}$ entre pares positivos y minimizarla entre negativos."
      },
    ],
    code: `import numpy as np
from numpy.linalg import norm

# ── 1. Similitud coseno: implementaciones ──────────────────────────────────
def similitud_coseno(x: np.ndarray, y: np.ndarray,
                     eps: float = 1e-10) -> float:
    """
    sim_cos(x,y) = x·y / (‖x‖·‖y‖).
    eps evita división por cero con vectores nulos.
    """
    return (x @ y) / (norm(x) * norm(y) + eps)

x = np.array([1.0,  2.0, 3.0])
y = np.array([2.0,  4.0, 6.0])   # paralelo a x (escala 2)
z = np.array([-1.0, 0.0, 1.0])   # oblicuo

print(f"sim_cos(x, y) = {similitud_coseno(x,y):.6f}")  # 1.0 exacto (paralelos)
print(f"sim_cos(x, z) = {similitud_coseno(x,z):.6f}")  # < 1

# ── 2. Invarianza a escala ─────────────────────────────────────────────────
for alpha, beta in [(1,1), (5,1), (1,100), (-1,1), (0.01,1000)]:
    s = similitud_coseno(alpha*x, beta*z)
    s0 = similitud_coseno(x, z)
    print(f"α={alpha:6}, β={beta:4}: sim={s:+.6f}  (ref={s0:+.6f})")
# Siempre igual en módulo, signo depende de sgn(α·β)

# ── 3. Relación con distancia euclidiana en vectores normalizados ──────────
def normalizar(v): return v / norm(v)

xh, zh = normalizar(x), normalizar(z)
dist_euclid_sq  = norm(xh - zh)**2
dist_coseno_x2  = 2*(1 - similitud_coseno(x, z))
print(f"\\n‖x̂-ẑ‖² = {dist_euclid_sq:.6f}")
print(f"2(1-cos) = {dist_coseno_x2:.6f}")
print(f"Son iguales: {np.isclose(dist_euclid_sq, dist_coseno_x2)}")

# ── 4. Correlación de Pearson = similitud coseno de vectores centrados ─────
rng = np.random.default_rng(42)
a = rng.standard_normal(50)
b = 0.8*a + 0.6*rng.standard_normal(50)  # correlación ~0.8

def pearson(a, b):
    return np.corrcoef(a, b)[0,1]

def coseno_centrado(a, b):
    a_c = a - a.mean()
    b_c = b - b.mean()
    return similitud_coseno(a_c, b_c)

print(f"\\nCorrelación Pearson:           {pearson(a,b):.6f}")
print(f"Similitud coseno (centrada):   {coseno_centrado(a,b):.6f}")
# Idénticos

# ── 5. Búsqueda por similitud coseno (mini sistema RAG) ───────────────────
documentos = [
    "El aprendizaje automático optimiza modelos con datos",
    "Las redes neuronales aprenden representaciones jerárquicas",
    "El álgebra lineal es la base del machine learning",
    "Python es el lenguaje más usado en ciencia de datos",
    "Los transformers usan atención para procesar secuencias",
]

# Embedding sintético: bag-of-words simplificado (TF crudo)
vocab_words = list(set(" ".join(documentos).lower().split()))
vocab = {w: i for i, w in enumerate(vocab_words)}

def vectorizar(texto: str, vocab: dict) -> np.ndarray:
    vec = np.zeros(len(vocab))
    for w in texto.lower().split():
        if w in vocab:
            vec[vocab[w]] += 1
    return vec

doc_vecs = np.array([vectorizar(d, vocab) for d in documentos])
doc_vecs_norm = doc_vecs / (norm(doc_vecs, axis=1, keepdims=True) + 1e-10)

consulta = "redes neuronales y aprendizaje profundo"
q_vec  = vectorizar(consulta, vocab)
q_norm = q_vec / (norm(q_vec) + 1e-10)

similitudes = doc_vecs_norm @ q_norm   # similitud coseno vectorizada
ranking = np.argsort(similitudes)[::-1]

print(f"\\nConsulta: '{consulta}'")
print("Ranking por similitud coseno:")
for idx in ranking:
    print(f"  {similitudes[idx]:.4f}  {documentos[idx]}")

# ── 6. Distancia angular (métrica) ────────────────────────────────────────
def dist_angular(x, y):
    cos = np.clip(similitud_coseno(x, y), -1, 1)
    return np.arccos(cos) / np.pi

print(f"\\nDistancia angular(x,z) = {dist_angular(x,z):.4f} ∈ [0,1]")`,
    related: ["Producto Punto", "Norma de un Vector", "Distancia Euclidiana", "Embeddings", "Mecanismo de Atención"],
    hasViz: true,
    vizType: "cosineSimilarity",
  },
  {
    id: 23,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Ortogonalidad y Proyección Vectorial",
    tags: ["álgebra lineal", "ortogonalidad", "proyección", "descomposición", "gram-schmidt", "PCA"],
    definition: "Dos vectores son ortogonales si su producto punto es cero, lo que geométricamente equivale a un ángulo de 90° entre ellos. La proyección ortogonal de un vector $\\mathbf{v}$ sobre un subespacio $W$ es el único vector $\\hat{\\mathbf{v}} \\in W$ que minimiza la distancia $\\|\\mathbf{v} - \\hat{\\mathbf{v}}\\|_2$, descomponiendo $\\mathbf{v}$ en una componente dentro de $W$ y otra perpendicular a $W$. Esta descomposición es el fundamento geométrico de mínimos cuadrados, PCA y la mayoría de métodos de reducción dimensional.",
    formal: {
      notation: "Sean $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n$ y $W \\subseteq \\mathbb{R}^n$ subespacio",
      body: "\\mathbf{u} \\perp \\mathbf{v} \\iff \\mathbf{u}^\\top\\mathbf{v} = 0 \\\\[10pt] \\text{proj}_W(\\mathbf{v}) = P_W\\mathbf{v}, \\quad P_W = Q Q^\\top \\\\[6pt] \\text{donde las columnas de } Q \\in \\mathbb{R}^{n \\times k} \\text{ forman una base ortonormal de } W",
      geometric: "\\text{proj}_{\\mathbf{u}}(\\mathbf{v}) = \\frac{\\mathbf{u}^\\top\\mathbf{v}}{\\mathbf{u}^\\top\\mathbf{u}}\\,\\mathbf{u} = (\\hat{\\mathbf{u}}^\\top\\mathbf{v})\\,\\hat{\\mathbf{u}} \\qquad (W = \\text{span}\\{\\mathbf{u}\\})",
      properties: [
        "\\text{Idempotencia: } P_W^2 = P_W \\quad (\\text{proyectar dos veces no cambia nada})",
        "\\text{Simetría: } P_W^\\top = P_W \\quad (P_W \\text{ es matriz simétrica})",
        "\\text{Complemento: } P_{W^\\perp} = I - P_W, \\quad \\mathbf{v} = P_W\\mathbf{v} + P_{W^\\perp}\\mathbf{v}",
      ],
    },
    intuition: "Imagina que $\\mathbf{v}$ es una flecha en el espacio y $W$ es el suelo. La proyección ortogonal $\\hat{\\mathbf{v}}$ es exactamente la sombra que deja $\\mathbf{v}$ con luz vertical: el punto del suelo más cercano a la punta de la flecha. El vector residual $\\mathbf{v} - \\hat{\\mathbf{v}}$ es la 'altura' de la flecha, perpendicular al suelo. Esta descomposición es óptima en el sentido de mínimos cuadrados: ningún otro punto del suelo está más cerca de la punta de $\\mathbf{v}$.",
    development: [
      {
        label: "Ortogonalidad: definición y consecuencias",
        body: "Dos vectores $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n$ son **ortogonales** ($\\mathbf{u} \\perp \\mathbf{v}$) si y solo si $\\mathbf{u}^\\top\\mathbf{v} = 0$. Para vectores no nulos esto equivale a $\\cos\\theta = 0 \\Rightarrow \\theta = 90°$.\n\nUna consecuencia inmediata es el **teorema de Pitágoras generalizado**: si $\\mathbf{u} \\perp \\mathbf{v}$, entonces:\n\n$$\\|\\mathbf{u} + \\mathbf{v}\\|^2 = \\|\\mathbf{u}\\|^2 + \\|\\mathbf{v}\\|^2$$\n\nUn conjunto $\\{\\mathbf{q}_1,\\ldots,\\mathbf{q}_k\\}$ es **ortonormal** si $\\mathbf{q}_i^\\top\\mathbf{q}_j = \\delta_{ij}$, es decir, cada par es ortogonal y cada vector tiene norma 1. Un conjunto ortonormal es automáticamente linealmente independiente, y una matriz $Q$ con columnas ortonormales satisface $Q^\\top Q = I_k$ (aunque $QQ^\\top \\neq I_n$ si $k < n$)."
      },
      {
        label: "Proyección sobre un vector y sobre un subespacio",
        body: "La **proyección de $\\mathbf{v}$ sobre $\\mathbf{u}$** (subespacio de dimensión 1) se obtiene resolviendo $\\min_{\\alpha} \\|\\mathbf{v} - \\alpha\\mathbf{u}\\|^2$, cuya solución es:\n\n$$\\hat{\\mathbf{v}} = \\frac{\\mathbf{u}^\\top\\mathbf{v}}{\\mathbf{u}^\\top\\mathbf{u}}\\mathbf{u} = \\frac{\\mathbf{u}\\mathbf{u}^\\top}{\\mathbf{u}^\\top\\mathbf{u}}\\mathbf{v} = P_{\\mathbf{u}}\\mathbf{v}$$\n\nPara un subespacio $W$ de dimensión $k$ con base ortonormal $Q = [\\mathbf{q}_1 \\mid \\cdots \\mid \\mathbf{q}_k]$, la **matriz de proyección** es:\n\n$$P_W = QQ^\\top = \\sum_{i=1}^k \\mathbf{q}_i\\mathbf{q}_i^\\top$$\n\nSi la base no es ortonormal sino $A = [\\mathbf{a}_1 \\mid \\cdots \\mid \\mathbf{a}_k]$, la fórmula general es:\n\n$$P_W = A(A^\\top A)^{-1}A^\\top$$\n\nque requiere que $A$ tenga columnas linealmente independientes. Esta es exactamente la **solución de mínimos cuadrados** $\\hat{\\mathbf{x}} = (A^\\top A)^{-1}A^\\top\\mathbf{b}$."
      },
      {
        label: "Proceso de Gram-Schmidt y factorización QR",
        body: "El **proceso de Gram-Schmidt** convierte una base arbitraria $\\{\\mathbf{a}_1,\\ldots,\\mathbf{a}_k\\}$ en una base ortonormal $\\{\\mathbf{q}_1,\\ldots,\\mathbf{q}_k\\}$ del mismo subespacio, restando iterativamente las proyecciones sobre los vectores ya ortonormalizados:\n\n$$\\mathbf{u}_j = \\mathbf{a}_j - \\sum_{i=1}^{j-1} (\\mathbf{q}_i^\\top\\mathbf{a}_j)\\,\\mathbf{q}_i, \\qquad \\mathbf{q}_j = \\frac{\\mathbf{u}_j}{\\|\\mathbf{u}_j\\|}$$\n\nEste proceso produce la **factorización QR**: $A = QR$, donde $Q$ tiene columnas ortonormales y $R$ es triangular superior con entradas $r_{ij} = \\mathbf{q}_i^\\top\\mathbf{a}_j$. La factorización QR es numéricamente más estable que calcular $(A^\\top A)^{-1}$ directamente para mínimos cuadrados, y es la base de algoritmos de eigenvalores (QR iteration)."
      },
      {
        label: "En Machine Learning / PCA y Mínimos Cuadrados",
        body: "La proyección ortogonal es el núcleo geométrico de los dos algoritmos más fundamentales en ML:\n\n**Mínimos Cuadrados**: dado $A\\mathbf{x} \\approx \\mathbf{b}$ con $A \\in \\mathbb{R}^{m\\times n}$, $m > n$, la solución $\\hat{\\mathbf{x}} = (A^\\top A)^{-1}A^\\top\\mathbf{b}$ es la proyección de $\\mathbf{b}$ sobre $\\text{Col}(A)$. El residuo $\\mathbf{b} - A\\hat{\\mathbf{x}}$ es ortogonal a cada columna de $A$, lo que se expresa como las **ecuaciones normales**: $A^\\top(\\mathbf{b} - A\\hat{\\mathbf{x}}) = \\mathbf{0}$.\n\n**PCA**: busca la dirección $\\mathbf{u}_1 \\in S^{n-1}$ que maximiza la varianza de las proyecciones $\\{\\mathbf{u}_1^\\top\\mathbf{x}_i\\}$. La solución es el eigenvector dominante de la matriz de covarianza $\\Sigma$. Los $k$ componentes principales son una base ortonormal $\\{\\mathbf{u}_1,\\ldots,\\mathbf{u}_k\\}$ que define el mejor subespacio de dimensión $k$ en sentido $L^2$:\n\n$$\\min_{\\text{rank}(P)=k} \\sum_{i=1}^n \\|\\mathbf{x}_i - P\\mathbf{x}_i\\|^2 \\quad \\Rightarrow \\quad P = \\sum_{j=1}^k \\mathbf{u}_j\\mathbf{u}_j^\\top$$\n\nEn **redes neuronales**, las capas de atención proyectan queries sobre el subespacio de keys mediante $\\text{softmax}(QK^\\top/\\sqrt{d})$, una forma suavizada de proyección ortogonal."
      },
    ],
    code: `import numpy as np
from numpy.linalg import norm, qr

# ── 1. Ortogonalidad y verificación ────────────────────────────────────────
u = np.array([1.0, 2.0, 3.0])
v = np.array([1.0, 1.0, -1.0])   # ¿ortogonal a u?

dot = u @ v
print(f"u · v = {dot:.6f}  {'→ ortogonales ✓' if np.isclose(dot,0) else '→ NO ortogonales'}")

# Teorema de Pitágoras generalizado
if np.isclose(dot, 0):
    print(f"‖u+v‖² = {norm(u+v)**2:.4f}")
    print(f"‖u‖²+‖v‖² = {norm(u)**2 + norm(v)**2:.4f}")

# ── 2. Proyección sobre un vector ──────────────────────────────────────────
def proj_vector(v: np.ndarray, u: np.ndarray) -> np.ndarray:
    """Proyección ortogonal de v sobre span{u}."""
    return (u @ v) / (u @ u) * u

v = np.array([3.0, 4.0, 0.0])
u = np.array([1.0, 0.0, 0.0])   # eje x

v_hat  = proj_vector(v, u)       # componente en dirección u
v_perp = v - v_hat               # componente perpendicular

print(f"\\nv       = {v}")
print(f"proj_u(v)= {v_hat}   (en span{{u}})")
print(f"residuo  = {v_perp}  (⊥ a u)")
print(f"ortogonalidad: (v_hat · v_perp) = {v_hat @ v_perp:.2e}")  # ≈ 0
print(f"Pitágoras: {norm(v)**2:.4f} = {norm(v_hat)**2:.4f} + {norm(v_perp)**2:.4f}")

# ── 3. Matriz de proyección P = uu^T / (u^Tu) ─────────────────────────────
def matriz_proyeccion_vector(u: np.ndarray) -> np.ndarray:
    """P = u u^T / (u^T u). Idempotente y simétrica."""
    return np.outer(u, u) / (u @ u)

P = matriz_proyeccion_vector(u)
print(f"\\nP² = P (idempotente): {np.allclose(P @ P, P)}")
print(f"P  = P^T (simétrica):  {np.allclose(P, P.T)}")
print(f"Proyección: P·v = {P @ v}")  # mismo resultado que proj_vector

# ── 4. Proyección sobre subespacio (base ortonormal) ──────────────────────
def proj_subespacio(Q: np.ndarray, v: np.ndarray) -> np.ndarray:
    """
    Proyección de v sobre Col(Q) donde Q tiene columnas ortonormales.
    P_W = Q Q^T,  proj = Q Q^T v = Q (Q^T v)
    """
    coords = Q.T @ v          # coordenadas en la base ortonormal
    return Q @ coords         # reconstrucción en el subespacio

# Subespacio W = span{e1, e2} en R^3
Q = np.eye(3)[:, :2]   # primeras dos columnas canónicas (ya ortonormales)
v3 = np.array([2.0, -1.0, 5.0])

v3_hat  = proj_subespacio(Q, v3)
v3_perp = v3 - v3_hat

print(f"\\nv          = {v3}")
print(f"proj_W(v)  = {v3_hat}   (en W = span{{e1,e2}})")
print(f"residuo    = {v3_perp}  (en W⊥)")
print(f"Ortogonalidad: {np.allclose(v3_hat @ v3_perp, 0)}")

# ── 5. Proceso de Gram-Schmidt ─────────────────────────────────────────────
def gram_schmidt(A: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """
    Factorización QR via Gram-Schmidt clásico.
    A: matriz n×k con columnas linealmente independientes.
    Devuelve Q (n×k ortonormal) y R (k×k triangular superior).
    """
    n, k = A.shape
    Q = np.zeros((n, k))
    R = np.zeros((k, k))
    for j in range(k):
        v = A[:, j].copy()
        for i in range(j):
            R[i, j] = Q[:, i] @ A[:, j]   # coeficiente de proyección
            v = v - R[i, j] * Q[:, i]      # restar proyección
        R[j, j] = norm(v)
        Q[:, j] = v / R[j, j]             # normalizar
    return Q, R

A = np.array([[1., 1., 0.],
              [0., 1., 1.],
              [1., 0., 1.]])

Q_gs, R_gs = gram_schmidt(A)
Q_np, R_np = qr(A)

print(f"\\nGram-Schmidt — Q^TQ = I: {np.allclose(Q_gs.T @ Q_gs, np.eye(3))}")
print(f"Reconstrucción A = QR:    {np.allclose(Q_gs @ R_gs, A)}")

# ── 6. Mínimos cuadrados via QR ────────────────────────────────────────────
# Ajuste lineal y = β₀ + β₁x con más ecuaciones que incógnitas
rng = np.random.default_rng(7)
x_data = np.linspace(0, 5, 20)
y_data = 2.5*x_data + 1.0 + rng.standard_normal(20)

# Matriz de diseño A
A_ls = np.column_stack([np.ones_like(x_data), x_data])

# QR → solución triangular (más estable que (A^TA)^{-1}A^T)
Q_ls, R_ls = np.linalg.qr(A_ls)
beta_qr = np.linalg.solve(R_ls, Q_ls.T @ y_data)

# Verificación directa
beta_direct = np.linalg.lstsq(A_ls, y_data, rcond=None)[0]
print(f"\\nMínimos cuadrados (QR):     β₀={beta_qr[0]:.4f}, β₁={beta_qr[1]:.4f}")
print(f"Mínimos cuadrados (directo): β₀={beta_direct[0]:.4f}, β₁={beta_direct[1]:.4f}")
print(f"Residuo ⊥ Col(A): {np.allclose(A_ls.T @ (y_data - A_ls@beta_qr), 0, atol=1e-10)}")`,
    related: ["Producto Punto", "Similitud Coseno", "Descomposición SVD", "PCA", "Mínimos Cuadrados"],
    hasViz: true,
    vizType: "orthogonalProjection",
  },
  {
    id: 24,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Matriz y Tipos (Identidad, Diagonal, Simétrica)",
    tags: ["álgebra lineal", "matrices", "identidad", "diagonal", "simétrica", "tipos de matrices"],
    definition: "Una matriz $A \\in \\mathbb{R}^{m \\times n}$ es un arreglo rectangular de escalares con $m$ filas y $n$ columnas que representa una transformación lineal $T: \\mathbb{R}^n \\to \\mathbb{R}^m$. Los tipos especiales —identidad, diagonal y simétrica— aparecen en prácticamente todo algoritmo de ML: codifican invarianzas, simplifican inversiones y garantizan propiedades espectrales que hacen la optimización tratable.",
    formal: {
      notation: "Sea $A \\in \\mathbb{R}^{m \\times n}$ con entradas $(A)_{ij} = a_{ij}$",
      body: "I_n = (\\delta_{ij}) \\quad \\text{(identidad)} \\\\[8pt] D = \\text{diag}(d_1,\\ldots,d_n) \\iff a_{ij} = 0 \\ \\forall i \\neq j \\quad \\text{(diagonal)} \\\\[8pt] A = A^\\top \\iff a_{ij} = a_{ji} \\ \\forall i,j \\quad \\text{(simétrica)}",
      geometric: "A\\mathbf{e}_j = \\mathbf{a}_j \\quad (\\text{columna } j \\text{ = imagen del } j\\text{-ésimo vector canónico})",
      properties: [
        "\\text{Identidad: } I_n A = A I_m = A, \\quad A^{-1}A = AA^{-1} = I_n \\text{ (si } A \\text{ invertible)}",
        "\\text{Diagonal: } D^k = \\text{diag}(d_1^k,\\ldots,d_n^k), \\quad D^{-1} = \\text{diag}(1/d_1,\\ldots,1/d_n) \\text{ si } d_i \\neq 0",
        "\\text{Simétrica: eigenvalores } \\in \\mathbb{R} \\text{ y eigenvectores ortonormales (teorema espectral)}",
      ],
    },
    intuition: "Una matriz es una tabla de números que transforma vectores: multiplica entradas, mezcla dimensiones. La identidad $I$ es el 'no hacer nada' — deja todo igual. Una diagonal $D$ estira o comprime cada eje independientemente sin mezclarlos: el eje $i$ se escala por $d_i$. Una simétrica $A = A^\\top$ es la más especial: garantiza que sus ejes de transformación (eigenvectores) son perpendiculares entre sí, haciendo la geometría predecible y la optimización convexa. Es como una lupa que puede estirar el espacio, pero sin rotarlo.",
    development: [
      {
        label: "Anatomía de una matriz y álgebra matricial",
        body: "Una matriz $A \\in \\mathbb{R}^{m \\times n}$ puede leerse como colección de **vectores columna** $A = [\\mathbf{a}_1 | \\cdots | \\mathbf{a}_n]$ o de **vectores fila** $A = [\\mathbf{r}_1^\\top; \\cdots; \\mathbf{r}_m^\\top]$. El producto $A\\mathbf{x}$ es entonces una **combinación lineal de columnas**:\n\n$$A\\mathbf{x} = \\sum_{j=1}^n x_j \\mathbf{a}_j$$\n\nEl producto matricial $C = AB$ con $A \\in \\mathbb{R}^{m\\times k}$, $B \\in \\mathbb{R}^{k\\times n}$ tiene entradas $c_{ij} = \\mathbf{r}_i^\\top \\mathbf{b}_j = \\sum_{l=1}^k a_{il}b_{lj}$, composición de transformaciones. El producto **no es conmutativo** en general: $AB \\neq BA$.\n\nLa **transpuesta** invierte filas y columnas: $(A^\\top)_{ij} = a_{ji}$, satisfaciendo $(AB)^\\top = B^\\top A^\\top$ y $(A^\\top)^{-1} = (A^{-1})^\\top$."
      },
      {
        label: "Matriz identidad y matrices especiales",
        body: "La **matriz identidad** $I_n = \\text{diag}(1,\\ldots,1)$ es el elemento neutro de la multiplicación: $AI_n = I_m A = A$. Su generalización, la **matriz de permutación** $P$, reordena filas/columnas y satisface $P^{-1} = P^\\top$.\n\nOtros tipos importantes en ML:\n\n- **Triangular superior/inferior**: $U$ con $u_{ij}=0$ para $i>j$; aparece en factorización $LU$ y $QR$.\n- **Ortogonal**: $Q^\\top Q = QQ^\\top = I$; preserva normas y ángulos, $\\det(Q) = \\pm 1$.\n- **Positiva semidefinida (PSD)**: $A \\succeq 0 \\iff \\mathbf{x}^\\top A \\mathbf{x} \\geq 0 \\ \\forall \\mathbf{x}$; toda matriz de covarianza es PSD.\n- **Estocástica**: filas (o columnas) suman 1 y son no negativas; modelos de Markov."
      },
      {
        label: "Matrices diagonales: eficiencia computacional",
        body: "Una matriz diagonal $D = \\text{diag}(d_1,\\ldots,d_n)$ actúa sobre vectores como **escalado independiente por eje**:\n\n$$D\\mathbf{x} = (d_1 x_1, d_2 x_2, \\ldots, d_n x_n)^\\top$$\n\nSus operaciones son todas $\\mathcal{O}(n)$ en vez de $\\mathcal{O}(n^2)$ o $\\mathcal{O}(n^3)$:\n\n$$D^k = \\text{diag}(d_1^k,\\ldots,d_n^k), \\quad D^{-1} = \\text{diag}(1/d_1,\\ldots,1/d_n), \\quad \\det(D) = \\prod_i d_i$$\n\nEl producto $D_1 D_2 = \\text{diag}(d_1^{(1)}d_1^{(2)},\\ldots)$ y las matrices diagonales conmutan entre sí. En SVD, $A = U\\Sigma V^\\top$, la matriz $\\Sigma$ es diagonal con los **valores singulares** — los 'factores de escala' propios de $A$."
      },
      {
        label: "Matrices simétricas y el Teorema Espectral",
        body: "Una matriz $A \\in \\mathbb{R}^{n\\times n}$ es **simétrica** si $A = A^\\top$. El **Teorema Espectral** garantiza la descomposición:\n\n$$A = Q\\Lambda Q^\\top = \\sum_{i=1}^n \\lambda_i \\mathbf{q}_i \\mathbf{q}_i^\\top$$\n\ndonde $Q$ es ortogonal (eigenvectores), $\\Lambda = \\text{diag}(\\lambda_1,\\ldots,\\lambda_n)$ (eigenvalores reales). Esta descomposición es una **diagonalización ortogonal**, imposible en general para matrices no simétricas.\n\nSubtipos fundamentales según el signo de los eigenvalores:\n\n- **Definida positiva** (PD): $\\lambda_i > 0 \\ \\forall i \\iff \\mathbf{x}^\\top A\\mathbf{x} > 0 \\ \\forall \\mathbf{x}\\neq\\mathbf{0}$\n- **Semidefinida positiva** (PSD): $\\lambda_i \\geq 0 \\ \\forall i$\n- **Indefinida**: eigenvalores de ambos signos\n\nLas matrices de covarianza $\\Sigma = \\frac{1}{n}X^\\top X$ son siempre PSD; la Hessiana de una función convexa es PSD."
      },
      {
        label: "En Machine Learning",
        body: "Los tipos de matrices determinan la eficiencia y propiedades de cada algoritmo:\n\n**Identidad en regularización**: Ridge añade $\\lambda I$ a la Hessiana $X^\\top X$, garantizando invertibilidad: $\\hat{\\boldsymbol{\\beta}} = (X^\\top X + \\lambda I)^{-1}X^\\top\\mathbf{y}$. El desplazamiento $\\lambda I$ eleva todos los eigenvalores por $\\lambda$, convirtiendo matrices PSD en PD.\n\n**Diagonal en normalización**: Batch Normalization mantiene una matriz diagonal de escalas $\\gamma$ y desplazamientos $\\beta$ por feature. Adam y RMSProp aproximan la Hessiana con una **diagonal**: $H \\approx \\text{diag}(v_1,\\ldots,v_n)$ donde $v_i$ estima la curvatura en cada dirección, permitiendo tasas de aprendizaje adaptativas con coste $\\mathcal{O}(n)$.\n\n**Simétrica en atención y covarianza**: la matriz de atención $\\text{softmax}(QK^\\top/\\sqrt{d})$ es cuadrada (no necesariamente simétrica), pero en **self-attention** con $Q=K$ la versión pre-softmax $QQ^\\top/\\sqrt{d}$ sí lo es. La **matriz de Gram** $G = X^\\top X \\in \\mathbb{R}^{n\\times n}$ es simétrica PSD y aparece en kernel methods (SVM, Gaussian Processes)."
      },
    ],
    code: `import numpy as np
from numpy.linalg import inv, det, eigh, matrix_power

# ── 1. Construcción de tipos especiales ────────────────────────────────────
n = 4

I  = np.eye(n)                                   # Identidad
D  = np.diag([3.0, -1.0, 2.5, 0.5])             # Diagonal
rng = np.random.default_rng(42)
M  = rng.standard_normal((n, n))
S  = (M + M.T) / 2                               # Simétrica (simetrizar M)

print("Identidad I:")
print(I)

print("\\nDiagonal D:", np.diag(D))              # Solo diagonal principal
print(f"\\nSimétrica — A=Aᵀ: {np.allclose(S, S.T)}")

# ── 2. Propiedades de la identidad ─────────────────────────────────────────
A = rng.standard_normal((3, 4))
print(f"\\nI·A = A: {np.allclose(np.eye(3) @ A, A)}")
print(f"A·I = A: {np.allclose(A @ np.eye(4), A)}")

# ── 3. Álgebra de matrices diagonales: O(n) ────────────────────────────────
d = np.array([2.0, -3.0, 5.0, 0.5])
D = np.diag(d)

print(f"\\nD² (entrada a entrada): {np.diag(D @ D)}")
print(f"d²                      {d**2}")            # idéntico, O(n)

print(f"D⁻¹: {np.diag(inv(D)).round(4)}")
print(f"1/d : {(1/d).round(4)}")                    # idéntico

print(f"det(D) = {det(D):.4f} = prod(d) = {np.prod(d):.4f}")

# Potencia de matriz diagonal
k = 5
print(f"D^{k} diagonal: {np.diag(matrix_power(D, k)).round(2)}")
print(f"d^{k}          {(d**k).round(2)}")

# ── 4. Teorema espectral para matrices simétricas ──────────────────────────
# eigh: versión optimizada para simétricas, eigenvalores reales garantizados
eigenvalores, Q = eigh(S)   # Q columnas = eigenvectores ortonormales

print(f"\\nEigenvalores (reales): {eigenvalores.round(4)}")
print(f"Q ortogonal — QᵀQ = I: {np.allclose(Q.T @ Q, np.eye(n))}")

# Reconstrucción: S = Q Λ Qᵀ = Σ λᵢ qᵢqᵢᵀ
Lambda = np.diag(eigenvalores)
S_rec  = Q @ Lambda @ Q.T
print(f"S = QΛQᵀ reconstruida:  {np.allclose(S, S_rec)}")

# Reconstrucción como suma de matrices de rango 1
S_outer = sum(eigenvalores[i] * np.outer(Q[:,i], Q[:,i]) for i in range(n))
print(f"S = Σ λᵢqᵢqᵢᵀ:         {np.allclose(S, S_outer)}")

# ── 5. Positividad: PSD y PD ───────────────────────────────────────────────
def es_psd(A: np.ndarray, tol: float = 1e-10) -> bool:
    """A es PSD iff todos sus eigenvalores son >= 0."""
    return bool(np.all(eigh(A)[0] >= -tol))

def es_pd(A: np.ndarray, tol: float = 1e-10) -> bool:
    """A es PD iff todos sus eigenvalores son > 0."""
    return bool(np.all(eigh(A)[0] > tol))

# Matriz de covarianza empírica (siempre PSD)
X  = rng.standard_normal((20, n))
Sigma = X.T @ X / 20
print(f"\\nCovarianza Σ — PSD: {es_psd(Sigma)}, PD: {es_pd(Sigma)}")

# Ridge: Σ + λI es siempre PD
lam   = 0.1
Sigma_ridge = Sigma + lam * np.eye(n)
print(f"Σ + λI       — PSD: {es_psd(Sigma_ridge)}, PD: {es_pd(Sigma_ridge)}")

# ── 6. Ridge regression: rol de I ─────────────────────────────────────────
X_data = rng.standard_normal((30, 3))
y_data = X_data @ np.array([1.5, -2.0, 0.8]) + 0.5*rng.standard_normal(30)

lam = 1.0
# (XᵀX + λI)⁻¹ Xᵀy
beta_ridge = inv(X_data.T @ X_data + lam*np.eye(3)) @ X_data.T @ y_data
print(f"\\nRidge β = {beta_ridge.round(4)}")
print(f"(XᵀX + λI) es PD: {es_pd(X_data.T @ X_data + lam*np.eye(3))}")`,
    related: ["Transformaciones Lineales", "Eigenvalores y Eigenvectores", "Descomposición SVD", "Determinante", "PCA"],
    hasViz: true,
    vizType: "matrixTypes",
  },
  {
    id: 25,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Operaciones entre Matrices y Transposición",
    tags: ["álgebra lineal", "matrices", "multiplicación matricial", "transposición", "producto externo", "broadcasting"],
    definition: "Las operaciones fundamentales entre matrices son la suma (entrada a entrada, requiere mismas dimensiones), el producto escalar (escala todas las entradas) y el producto matricial (composición de transformaciones lineales, requiere dimensiones compatibles). La transposición $A^\\top$ intercambia filas por columnas. Estas operaciones son el vocabulario computacional de todo ML: cada forward pass, cada actualización de gradientes y cada capa de atención se expresa como combinaciones de ellas.",
    formal: {
      notation: "Sean $A \\in \\mathbb{R}^{m \\times k}$, $B \\in \\mathbb{R}^{k \\times n}$, $\\alpha \\in \\mathbb{R}$",
      body: "(A + B)_{ij} = a_{ij} + b_{ij} \\quad (m=k,\\ \\text{mismas dims}) \\\\[8pt] (\\alpha A)_{ij} = \\alpha\\, a_{ij} \\\\[8pt] (AB)_{ij} = \\sum_{l=1}^{k} a_{il}\\, b_{lj} = \\mathbf{r}_i^\\top \\mathbf{c}_j \\\\[8pt] (A^\\top)_{ij} = a_{ji}",
      geometric: "AB = \\sum_{l=1}^{k} \\mathbf{a}_{:l}\\, \\mathbf{b}_{l:} \\quad (\\text{suma de } k \\text{ matrices de rango 1})",
      properties: [
        "\\text{No conmutatividad: } AB \\neq BA \\text{ en general; sí } (AB)^\\top = B^\\top A^\\top",
        "\\text{Asociatividad: } (AB)C = A(BC), \\quad \\text{coste mínimo por paréntesis óptimos}",
        "\\text{Transpuesta compuesta: } (ABC)^\\top = C^\\top B^\\top A^\\top",
      ],
    },
    intuition: "Multiplicar matrices es componer transformaciones: $AB$ significa 'primero aplica $B$, luego aplica $A$'. Si $B$ rota y $A$ escala, $AB$ rota-y-luego-escala. La no conmutatividad es intuitiva: escalar-y-luego-rotar ≠ rotar-y-luego-escalar. La transposición 'voltea' la matriz sobre su diagonal — convierte vectores columna en fila, intercambia el rol de filas y columnas, e invierte el orden en productos. El producto externo $\\mathbf{u}\\mathbf{v}^\\top$ es la matriz 'más simple posible': rango 1, todo el contenido en una sola dirección.",
    development: [
      {
        label: "Suma, escalar y producto de Hadamard",
        body: "La **suma matricial** $A + B$ requiere $A, B \\in \\mathbb{R}^{m \\times n}$ y opera entrada a entrada: $(A+B)_{ij} = a_{ij} + b_{ij}$. Es conmutativa, asociativa, y hereda las propiedades del espacio vectorial.\n\nEl **producto de Hadamard** (elemento a elemento) $A \\odot B$ también requiere mismas dimensiones:\n\n$$(A \\odot B)_{ij} = a_{ij} b_{ij}$$\n\nAparece en gates de redes recurrentes (LSTM, GRU) y en máscaras de atención. A diferencia del producto matricial, **sí es conmutativo**: $A \\odot B = B \\odot A$.\n\nEl **broadcasting** generaliza suma y Hadamard a dimensiones compatibles: si $\\mathbf{b} \\in \\mathbb{R}^n$, la operación $A + \\mathbf{b}^\\top$ suma $\\mathbf{b}^\\top$ a cada fila de $A \\in \\mathbb{R}^{m\\times n}$ — operación estándar al añadir sesgos en redes neuronales."
      },
      {
        label: "Producto matricial: cuatro interpretaciones",
        body: "El producto $C = AB$ con $A \\in \\mathbb{R}^{m\\times k}$, $B \\in \\mathbb{R}^{k\\times n}$ admite **cuatro perspectivas** equivalentes pero computacionalmente distintas:\n\n**1. Entrada a entrada** (definición): $c_{ij} = \\sum_l a_{il} b_{lj}$ — producto punto de fila $i$ de $A$ con columna $j$ de $B$. Coste $\\mathcal{O}(mnk)$.\n\n**2. Columna a columna**: $C_{:j} = A\\mathbf{b}_j$ — cada columna de $C$ es $A$ aplicado a la columna $j$ de $B$.\n\n**3. Fila a fila**: $C_{i:} = \\mathbf{a}_{i:} B$ — cada fila de $C$ es combinación lineal de filas de $B$ con pesos de fila $i$ de $A$.\n\n**4. Suma de rangos 1**: $C = \\sum_{l=1}^k \\mathbf{a}_{:l}\\mathbf{b}_{l:}^\\top$ — suma de $k$ matrices de rango 1, cada una producto externo de columna $l$ de $A$ con fila $l$ de $B$. Esta visión es la base de **low-rank approximation** y SVD."
      },
      {
        label: "Transposición: reglas y usos",
        body: "La transpuesta $A^\\top \\in \\mathbb{R}^{n\\times m}$ de $A \\in \\mathbb{R}^{m\\times n}$ satisface $(A^\\top)_{ij} = a_{ji}$. Reglas algebraicas esenciales:\n\n$$(A + B)^\\top = A^\\top + B^\\top$$\n\n$$(\\alpha A)^\\top = \\alpha A^\\top$$\n\n$$(AB)^\\top = B^\\top A^\\top \\quad \\text{(inversión del orden)}$$\n\n$$(A^\\top)^{-1} = (A^{-1})^\\top \\stackrel{\\text{def}}{=} A^{-\\top}$$\n\nLa regla $(AB)^\\top = B^\\top A^\\top$ tiene interpretación directa: si $AB$ compone '$B$ primero, $A$ después', la transpuesta invierte el orden de composición. En backpropagation, el gradiente fluye a través de $W^\\top$ exactamente porque la adjunta de una transformación lineal es su transpuesta."
      },
      {
        label: "Producto interno, externo y de matrices como sumas",
        body: "Tres productos relacionados con vectores $\\mathbf{u} \\in \\mathbb{R}^m$, $\\mathbf{v} \\in \\mathbb{R}^n$:\n\n**Producto interno** ($m=n$): $\\mathbf{u}^\\top\\mathbf{v} = \\sum_i u_i v_i \\in \\mathbb{R}$ — escalar, simetría.\n\n**Producto externo**: $\\mathbf{u}\\mathbf{v}^\\top \\in \\mathbb{R}^{m\\times n}$ — matriz de rango 1:\n\n$$\\mathbf{u}\\mathbf{v}^\\top = \\begin{pmatrix} u_1 v_1 & u_1 v_2 & \\cdots \\\\ u_2 v_1 & u_2 v_2 & \\cdots \\\\ \\vdots & & \\ddots \\end{pmatrix}$$\n\nEl producto externo descompone el producto matricial: $AB = \\sum_{l=1}^k \\mathbf{a}_{:l}\\mathbf{b}_{l:}$. En **backpropagation**, el gradiente de la pérdida respecto a $W \\in \\mathbb{R}^{m\\times n}$ en la capa $\\mathbf{h} = W\\mathbf{x}$ es exactamente un producto externo:\n\n$$\\nabla_W \\mathcal{L} = \\boldsymbol{\\delta} \\mathbf{x}^\\top \\in \\mathbb{R}^{m\\times n}$$\n\ndonde $\\boldsymbol{\\delta} = \\nabla_{\\mathbf{h}}\\mathcal{L}$ es el error que llega de la capa siguiente."
      },
      {
        label: "En Machine Learning",
        body: "El forward pass de una red neuronal densa es una cascada de multiplicaciones matriciales intercaladas con no-linealidades:\n\n$$\\mathbf{h}^{(l)} = \\sigma(W^{(l)}\\mathbf{h}^{(l-1)} + \\mathbf{b}^{(l)})$$\n\nEl **backpropagation** es la regla de la cadena aplicada a estas operaciones matriciales. Para la capa $l$:\n\n$$\\frac{\\partial \\mathcal{L}}{\\partial W^{(l)}} = \\boldsymbol{\\delta}^{(l)} (\\mathbf{h}^{(l-1)})^\\top \\quad (\\text{producto externo})$$\n\n$$\\boldsymbol{\\delta}^{(l-1)} = (W^{(l)})^\\top \\boldsymbol{\\delta}^{(l)} \\odot \\sigma'(\\mathbf{z}^{(l-1)}) \\quad (W^\\top \\text{ propaga el error hacia atrás})$$\n\nEn **Transformers**, la capa de atención computa $\\text{softmax}(QK^\\top / \\sqrt{d_k})V$: la transpuesta $K^\\top$ aparece explícitamente en el producto de similitudes. El coste $\\mathcal{O}(n^2 d)$ de $QK^\\top$ para secuencias de longitud $n$ es el cuello de botella que motiva **Flash Attention** y la atención lineal."
      },
    ],
    code: `import numpy as np

# ── 1. Suma, escalar y Hadamard ────────────────────────────────────────────
A = np.array([[1., 2., 3.],
              [4., 5., 6.]])           # (2,3)
B = np.array([[7., 0., -1.],
              [2., 3.,  4.]])          # (2,3)

print("A + B =\\n", A + B)
print("3·A   =\\n", 3 * A)
print("A ⊙ B =\\n", A * B)             # Hadamard: np.multiply(A, B)

# Broadcasting: sumar bias (vector fila) a cada fila de A
bias = np.array([10., 20., 30.])       # (3,) → broadcast a (2,3)
print("A + bias =\\n", A + bias)

# ── 2. Producto matricial: cuatro perspectivas ─────────────────────────────
M = np.array([[1., 2.],
              [3., 4.],
              [5., 6.]])               # (3,2)
N = np.array([[7., 8., 9.],
              [10.,11.,12.]])          # (2,3)

C_direct = M @ N                      # O(3·2·3) = O(18)

# Perspectiva 1: entrada a entrada
C_ij = np.array([[M[i] @ N[:,j] for j in range(3)] for i in range(3)])

# Perspectiva 2: columna a columna
C_cols = np.column_stack([M @ N[:,j] for j in range(3)])

# Perspectiva 4: suma de productos externos (rango 1)
C_outer = sum(np.outer(M[:,l], N[l,:]) for l in range(2))

assert np.allclose(C_direct, C_ij)    and \\
       np.allclose(C_direct, C_cols)  and \\
       np.allclose(C_direct, C_outer)
print("\\nLas 4 perspectivas coinciden ✓")
print("C = M @ N =\\n", C_direct)

# ── 3. Transposición: reglas algebraicas ───────────────────────────────────
P = np.random.default_rng(0).standard_normal((3, 4))
Q = np.random.default_rng(1).standard_normal((4, 2))

# (PQ)ᵀ = QᵀPᵀ
assert np.allclose((P @ Q).T, Q.T @ P.T)
print("\\n(PQ)ᵀ = QᵀPᵀ ✓")

# (Pᵀ)⁻¹ = (P⁻¹)ᵀ para matrices cuadradas invertibles
R = np.random.default_rng(2).standard_normal((4, 4))
R = R @ R.T + 4*np.eye(4)             # hacerla PD para garantizar invertibilidad
assert np.allclose(np.linalg.inv(R.T), np.linalg.inv(R).T)
print("(Rᵀ)⁻¹ = (R⁻¹)ᵀ ✓")

# ── 4. Producto externo y gradiente en backprop ────────────────────────────
# Simular una capa lineal h = W·x + b y su gradiente
rng = np.random.default_rng(42)
W   = rng.standard_normal((4, 3))     # pesos (out=4, in=3)
x   = rng.standard_normal(3)         # entrada
b   = np.zeros(4)                    # sesgo

h   = W @ x + b                      # forward pass
# Suponer delta = gradiente de pérdida respecto a h (llegado de arriba)
delta = rng.standard_normal(4)

# Gradientes por backprop
dW = np.outer(delta, x)              # (4,3) — producto externo
db = delta.copy()                    # (4,)
dx = W.T @ delta                     # (3,) — W transpuesta propaga error

print(f"\\ndW = δ·xᵀ ∈ ℝ^{{4×3}}:\\n{dW.round(4)}")
print(f"dx = Wᵀ·δ ∈ ℝ^3: {dx.round(4)}")

# ── 5. Atención simplificada: QKᵀ ─────────────────────────────────────────
seq_len, d_model, d_k = 6, 8, 4

rng2  = np.random.default_rng(7)
Wq, Wk, Wv = [rng2.standard_normal((d_model, d_k)) for _ in range(3)]
X_seq = rng2.standard_normal((seq_len, d_model))   # (T, d)

Q_mat = X_seq @ Wq                   # (T, d_k)
K_mat = X_seq @ Wk                   # (T, d_k)
V_mat = X_seq @ Wv                   # (T, d_k)

scores = Q_mat @ K_mat.T / np.sqrt(d_k)            # (T, T) — QKᵀ/√d

def softmax(x, axis=-1):
    e = np.exp(x - x.max(axis=axis, keepdims=True))
    return e / e.sum(axis=axis, keepdims=True)

attn   = softmax(scores)             # (T, T) — pesos de atención
output = attn @ V_mat                # (T, d_k) — contexto

print(f"\\nScores QKᵀ/√d  shape: {scores.shape}")
print(f"Atención (softmax) shape: {attn.shape}")
print(f"Output AV         shape: {output.shape}")
print(f"Filas de atención suman 1: {np.allclose(attn.sum(axis=1), 1)}")

# ── 6. Coste computacional y orden de multiplicación ─────────────────────
# Encadenado A(BC) vs (AB)C — mismo resultado, coste distinto
rng3 = np.random.default_rng(9)
A100 = rng3.standard_normal((100, 1))
B100 = rng3.standard_normal((1, 100))
C100 = rng3.standard_normal((100, 1))

# (AB)C: 100·1·100 + 100·100·1 = 10000+10000 = 20000 ops
# A(BC): 1·100·1  + 100·1·1   = 100+100 = 200 ops  ← mucho mejor
import time

t0 = time.perf_counter()
for _ in range(10000): _ = (A100 @ B100) @ C100
t1 = time.perf_counter()
for _ in range(10000): _ = A100 @ (B100 @ C100)
t2 = time.perf_counter()

print(f"\\n(AB)C: {(t1-t0)*1000:.1f} ms  |  A(BC): {(t2-t1)*1000:.1f} ms")
print("A(BC) es ~100× más rápido por orden óptimo de paréntesis")`,
    related: ["Transformación Lineal", "Determinante", "Eigenvalores y Eigenvectores", "Descomposición SVD", "Mecanismo de Atención"],
    hasViz: true,
    vizType: "matrixOps",
  },
  {
    id: 31,
    section: "II. Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Valores y Vectores Propios (Eigenvalues / Eigenvectors)",
    tags: ["eigenvalues", "eigenvectors", "descomposición espectral", "diagonalización", "álgebra lineal"],
    definition: "Dado un operador lineal representado por una matriz cuadrada A, un vector propio es un vector no nulo que bajo la acción de A solo cambia de escala (no de dirección). El escalar que determina ese factor de escala es el valor propio asociado. El par (λ, v) satisface la ecuación fundamental Av = λv, la cual caracteriza las direcciones invariantes del operador.",
    formal: {
      notation: "Sea $A \\in \\mathbb{R}^{n \\times n}$ y $(\\lambda, \\mathbf{v}) \\in \\mathbb{R} \\times (\\mathbb{R}^n \\setminus \\{\\mathbf{0}\\})$",
      body: "A\\mathbf{v} = \\lambda\\mathbf{v} \\iff (A - \\lambda I)\\mathbf{v} = \\mathbf{0} \\iff \\det(A - \\lambda I) = 0",
      geometric: "\\|A\\mathbf{v}\\| = |\\lambda|\\,\\|\\mathbf{v}\\|, \\quad \\text{dir}(A\\mathbf{v}) = \\begin{cases} \\text{dir}(\\mathbf{v}) & \\lambda > 0 \\\\ -\\text{dir}(\\mathbf{v}) & \\lambda < 0 \\\\ \\text{indefinida} & \\lambda = 0 \\end{cases}",
      properties: [
        "\\text{Polinomio característico: } p(\\lambda) = \\det(A - \\lambda I) \\in \\mathbb{R}[\\lambda],\\; \\deg(p) = n",
        "\\text{Traza y determinante: } \\mathrm{tr}(A) = \\sum_{i=1}^{n} \\lambda_i, \\quad \\det(A) = \\prod_{i=1}^{n} \\lambda_i",
        "\\text{Multiplicidad algebraica } m_a(\\lambda_i) \\geq \\text{multiplicidad geométrica } m_g(\\lambda_i) = \\dim\\ker(A - \\lambda_i I)",
        "\\text{Diagonalizable} \\iff m_a(\\lambda_i) = m_g(\\lambda_i) \\; \\forall\\, i \\iff A = P\\Lambda P^{-1}",
        "\\text{Si } A \\text{ es simétrica}: \\lambda_i \\in \\mathbb{R},\\; \\mathbf{v}_i \\perp \\mathbf{v}_j \\;(i \\neq j) \\Rightarrow A = Q\\Lambda Q^\\top \\text{ (TES)}",
      ],
    },
    intuition: "Imagina que $A$ es una transformación que estira, comprime o voltea el espacio. La gran mayoría de vectores cambian tanto de longitud como de dirección al multiplicarse por $A$. Los vectores propios son los ejes privilegiados del operador: vectores sobre los cuales $A$ actúa de forma tan simple como una multiplicación por escalar. Si $\\lambda > 1$ el espacio se estira en esa dirección; si $0 < \\lambda < 1$ se comprime; si $\\lambda < 0$ se voltea además de escalar. Los valores propios revelan cuánto 'poder' tiene el operador en cada dirección invariante.",
    development: [
      {
        label: "Ecuación característica y espectro",
        body: "El conjunto de todos los valores propios de $A$ se llama **espectro** de $A$, denotado $\\sigma(A)$. Se obtiene resolviendo el **polinomio característico**:\n\n$$p(\\lambda) = \\det(A - \\lambda I) = 0$$\n\nPara $A \\in \\mathbb{R}^{2 \\times 2}$, el polinomio es $\\lambda^2 - \\mathrm{tr}(A)\\lambda + \\det(A) = 0$, cuyas raíces pueden ser reales o complejas conjugadas. El **radio espectral** es $\\rho(A) = \\max_{\\lambda \\in \\sigma(A)} |\\lambda|$, cantidad fundamental en el análisis de convergencia de iteraciones matriciales."
      },
      {
        label: "Espacio propio y multiplicidades",
        body: "Fijado un valor propio $\\lambda_i$, el **espacio propio** (eigenspace) es el subespacio nulo:\n\n$$E_{\\lambda_i} = \\ker(A - \\lambda_i I) = \\{\\mathbf{v} \\in \\mathbb{R}^n : A\\mathbf{v} = \\lambda_i \\mathbf{v}\\}$$\n\nLa **multiplicidad geométrica** $m_g(\\lambda_i) = \\dim E_{\\lambda_i}$ siempre satisface $1 \\leq m_g \\leq m_a$, donde $m_a$ es la multiplicidad algebraica (orden de la raíz en $p(\\lambda)$). Cuando $m_a > m_g$ para algún $\\lambda_i$, la matriz no es diagonalizable y se requiere la **forma normal de Jordan**."
      },
      {
        label: "Diagonalización y Teorema Espectral",
        body: "Si $A$ posee $n$ vectores propios linealmente independientes $\\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_n\\}$, entonces es **diagonalizable**:\n\n$$A = P\\Lambda P^{-1}, \\quad P = [\\mathbf{v}_1 \\mid \\cdots \\mid \\mathbf{v}_n], \\quad \\Lambda = \\mathrm{diag}(\\lambda_1, \\ldots, \\lambda_n)$$\n\nPara matrices **simétricas** ($A = A^\\top$), el **Teorema Espectral** garantiza que: (i) todos los valores propios son reales, (ii) los espacios propios de valores propios distintos son ortogonales, y (iii) existe una factorización ortogonal:\n\n$$A = Q\\Lambda Q^\\top, \\quad Q^\\top Q = I$$\n\nEsto es la base de PCA y SVD."
      },
      {
        label: "Potencias de matrices y sistemas dinámicos",
        body: "La diagonalización permite calcular potencias e iteraciones de manera eficiente:\n\n$$A^k = P\\Lambda^k P^{-1}, \\quad \\Lambda^k = \\mathrm{diag}(\\lambda_1^k, \\ldots, \\lambda_n^k)$$\n\nEn un sistema dinámico $\\mathbf{x}_{t+1} = A\\mathbf{x}_t$, la solución es $\\mathbf{x}_t = A^t \\mathbf{x}_0 = \\sum_i c_i \\lambda_i^t \\mathbf{v}_i$. El sistema **converge a cero** si y solo si $\\rho(A) < 1$. El eigenvector asociado al mayor $|\\lambda_i|$ domina el comportamiento asintótico —principio explotado en el **algoritmo de la potencia** para encontrar el eigenvector dominante iterativamente."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "Los eigenvalores y eigenvectores son omnipresentes en ML:\n\n**PCA (Análisis de Componentes Principales):** se diagonaliza la matriz de covarianza $\\Sigma = \\frac{1}{n}X^\\top X \\in \\mathbb{R}^{d \\times d}$ (simétrica semidefinida positiva, $\\lambda_i \\geq 0$). Los eigenvectores son las componentes principales; los eigenvalores indican la varianza capturada:\n\n$$\\text{varianza explicada por } k \\text{ componentes} = \\frac{\\sum_{i=1}^{k} \\lambda_i}{\\sum_{i=1}^{n} \\lambda_i}$$\n\n**Redes Neuronales:** El eigenvalor máximo del Hessiano $H = \\nabla^2 \\mathcal{L}$ determina el **número de condición** $\\kappa = \\lambda_{\\max}/\\lambda_{\\min}$, que controla la dificultad de optimización con gradient descent. Un $\\kappa$ grande implica valles muy anisotrópicos donde el gradiente oscila. **Normalización espectral** de pesos ($W \\leftarrow W / \\sigma_1(W)$) es una técnica de regularización en GANs que controla el lipschitz bound del discriminador."
      },
    ],
    code: `import numpy as np
from numpy.linalg import eig, eigh

# ─── 1. Eigendescomposición general ────────────────────────────────────────────
A = np.array([[4, 1],
              [2, 3]], dtype=float)

eigenvalues, eigenvectors = eig(A)
print("Valores propios:", eigenvalues)          # [5. 2.]
print("Vectores propios (columnas):\\n", eigenvectors)

# Verificar Av = λv para el primer par
v0 = eigenvectors[:, 0]
lam0 = eigenvalues[0]
print("\\nAv - λv (debe ser ~0):", A @ v0 - lam0 * v0)

# ─── 2. Polinomio característico (verificación) ─────────────────────────────
# det(A - λI) = λ² - tr(A)λ + det(A) = 0
tr_A  = np.trace(A)          # 7  → suma de eigenvalores
det_A = np.linalg.det(A)     # 10 → producto de eigenvalores
print(f"\\ntr(A) = {tr_A:.1f}, sum(λ) = {sum(eigenvalues):.1f}")
print(f"det(A) = {det_A:.1f}, prod(λ) = {np.prod(eigenvalues):.1f}")

# ─── 3. Diagonalización A = P Λ P⁻¹ ────────────────────────────────────────
P      = eigenvectors
Lambda = np.diag(eigenvalues)
P_inv  = np.linalg.inv(P)
A_reconstructed = P @ Lambda @ P_inv
print("\\nReconstrucción A = PΛP⁻¹:\\n", np.round(A_reconstructed, 10))

# Potencia de matriz: A^5 = P Λ^5 P⁻¹
k = 5
A_k = P @ np.diag(eigenvalues**k) @ P_inv
print(f"\\nA^{k} via diagonalización:\\n", np.round(A_k))

# ─── 4. Matriz simétrica: Teorema Espectral (eigh es más estable) ────────────
Sigma = np.array([[3, 1, 0.5],
                  [1, 2, 0.3],
                  [0.5, 0.3, 1]], dtype=float)  # simétrica → covarianza

# eigh garantiza eigenvalores reales y eigenvectores ortonormales
eigenvalues_s, Q = eigh(Sigma)      # orden ascendente
eigenvalues_s = eigenvalues_s[::-1] # descendente (convención PCA)
Q = Q[:, ::-1]

# Varianza explicada (PCA)
var_total = eigenvalues_s.sum()
var_ratio = eigenvalues_s / var_total
cumvar    = np.cumsum(var_ratio)
print("\\n── PCA sobre Σ ──────────────────────────")
for i, (lam, vr, cv) in enumerate(zip(eigenvalues_s, var_ratio, cumvar)):
    print(f"  PC{i+1}: λ={lam:.4f}  var={vr*100:.1f}%  cum={cv*100:.1f}%")

# Verificar ortonormalidad: Q^T Q = I
print("\\nQ^T Q (debe ser I):\\n", np.round(Q.T @ Q, 10))

# ─── 5. Algoritmo de la potencia (eigenvalor dominante) ──────────────────────
def power_iteration(A, num_iter=1000, tol=1e-10):
    """Encuentra el eigenvalor de mayor módulo y su eigenvector."""
    b = np.random.rand(A.shape[0])
    b /= np.linalg.norm(b)
    lam_prev = 0
    for _ in range(num_iter):
        b_new = A @ b
        lam = np.dot(b, b_new)          # Rayleigh quotient
        b_new /= np.linalg.norm(b_new)
        if abs(lam - lam_prev) < tol:
            break
        b, lam_prev = b_new, lam
    return lam, b

lam_dom, v_dom = power_iteration(A)
print(f"\\nEigenvalor dominante (potencia): {lam_dom:.6f}")
print(f"Eigenvalor dominante (numpy):    {max(eigenvalues):.6f}")
`,
    related: [
      "Descomposición en Valores Singulares (SVD)",
      "Análisis de Componentes Principales (PCA)",
      "Forma Cuadrática y Definiteness",
      "Diagonalización y Forma Normal de Jordan",
      "Número de Condición y Estabilidad Numérica",
    ],
    hasViz: true,
    vizType: "eigenTransform",
  },
  {
    id: 32,
    section: "II. Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Diagonalización de Matrices",
    tags: ["diagonalización", "eigendescomposición", "cambio de base", "potencias de matriz", "álgebra lineal"],
    definition: "Una matriz cuadrada A es diagonalizable si existe una base de R^n formada por vectores propios de A. En tal caso, A es semejante a una matriz diagonal Λ cuyos elementos son los valores propios: existe una matriz invertible P tal que A = PΛP⁻¹. La diagonalización descompone el operador en sus direcciones invariantes, reduciendo transformaciones complejas a escalados independientes por eje propio.",
    formal: {
      notation: "Sea $A \\in \\mathbb{R}^{n \\times n}$ con valores propios $\\lambda_1, \\ldots, \\lambda_n$ y vectores propios $\\mathbf{v}_1, \\ldots, \\mathbf{v}_n$ linealmente independientes",
      body: "A = P\\Lambda P^{-1}, \\quad P = [\\mathbf{v}_1 \\mid \\cdots \\mid \\mathbf{v}_n] \\in \\mathbb{R}^{n \\times n}, \\quad \\Lambda = \\mathrm{diag}(\\lambda_1, \\ldots, \\lambda_n)",
      geometric: "A^k = P\\Lambda^k P^{-1}, \\quad \\Lambda^k = \\mathrm{diag}(\\lambda_1^k, \\ldots, \\lambda_n^k), \\quad e^A = Pe^{\\Lambda}P^{-1} = P\\,\\mathrm{diag}(e^{\\lambda_1},\\ldots,e^{\\lambda_n})P^{-1}",
      properties: [
        "\\text{Condición necesaria y suficiente: } A \\text{ diagonalizable} \\iff \\sum_{i} m_g(\\lambda_i) = n",
        "\\text{Condición suficiente: } n \\text{ valores propios distintos} \\Rightarrow A \\text{ diagonalizable}",
        "\\text{Matrices simétricas: siempre diagonalizables con } P = Q \\text{ ortogonal} \\Rightarrow A = Q\\Lambda Q^\\top",
        "\\text{Semejanza preserva espectro: } \\sigma(A) = \\sigma(P\\Lambda P^{-1}),\\; \\mathrm{tr}(A) = \\mathrm{tr}(\\Lambda),\\; \\det(A) = \\det(\\Lambda)",
        "\\text{No diagonalizable} \\Rightarrow \\exists\\, \\lambda_i : m_a(\\lambda_i) > m_g(\\lambda_i) \\Rightarrow \\text{forma normal de Jordan}",
      ],
    },
    intuition: "Diagonalizar es encontrar el sistema de coordenadas natural del operador. En la base propia $\\{\\mathbf{v}_i\\}$, la transformación $A$ actúa de la forma más simple posible: escalar independientemente cada coordenada por su $\\lambda_i$ correspondiente. La matriz $P^{-1}$ traduce al lenguaje propio, $\\Lambda$ ejecuta la transformación trivialmente, y $P$ traduce de vuelta. Es el cambio de idioma que convierte un problema difícil en uno trivial.",
    development: [
      {
        label: "Semejanza y cambio de base",
        body: "Dos matrices $A, B \\in \\mathbb{R}^{n \\times n}$ son **semejantes** si existe $P$ invertible tal que $B = P^{-1}AP$. La semejanza es una relación de equivalencia que preserva el polinomio característico, el espectro, la traza, el determinante y el rango.\n\nLa diagonalización es un caso especial donde $B = \\Lambda$ es diagonal. Si $A\\mathbf{v}_i = \\lambda_i \\mathbf{v}_i$, entonces en la base $\\{\\mathbf{v}_i\\}$ el operador actúa como:\n\n$$[A]_{\\mathcal{B}} = P^{-1}AP = \\Lambda = \\begin{pmatrix} \\lambda_1 & & \\\\ & \\ddots & \\\\ & & \\lambda_n \\end{pmatrix}$$\n\nEsto es precisamente el principio de **cambio de base**: el mismo operador lineal tiene representaciones matriciales distintas según la base elegida, y la base propia lo representa de forma diagonal."
      },
      {
        label: "Algoritmo de diagonalización",
        body: "El procedimiento para diagonalizar $A \\in \\mathbb{R}^{n \\times n}$ es:\n\n**Paso 1.** Calcular el polinomio característico $p(\\lambda) = \\det(A - \\lambda I)$ y hallar sus raíces $\\lambda_1, \\ldots, \\lambda_k$ (con multiplicidades algebraicas $m_a$).\n\n**Paso 2.** Para cada $\\lambda_i$, calcular $E_{\\lambda_i} = \\ker(A - \\lambda_i I)$ y obtener una base del espacio propio. La multiplicidad geométrica es $m_g(\\lambda_i) = n - \\mathrm{rank}(A - \\lambda_i I)$.\n\n**Paso 3.** Verificar $m_g(\\lambda_i) = m_a(\\lambda_i)$ para todo $i$. Si se cumple, $A$ es diagonalizable.\n\n**Paso 4.** Construir $P = [\\mathbf{v}_1 \\mid \\cdots \\mid \\mathbf{v}_n]$ con los vectores propios como columnas, y $\\Lambda = \\mathrm{diag}(\\lambda_1, \\ldots, \\lambda_n)$.\n\nVerificación: $AP = P\\Lambda$, equivalentemente $A\\mathbf{v}_i = \\lambda_i \\mathbf{v}_i$ para cada columna."
      },
      {
        label: "Potencias, funciones matriciales y sistemas dinámicos",
        body: "La diagonalización reduce el cálculo de potencias a operaciones escalares. Para $A = P\\Lambda P^{-1}$:\n\n$$A^k = (P\\Lambda P^{-1})^k = P\\Lambda^k P^{-1}$$\n\npuesto que los $P^{-1}P$ intermedios se cancelan telescópicamente. En coordenadas propias $\\mathbf{c} = P^{-1}\\mathbf{x}_0$, la solución del sistema dinámico $\\mathbf{x}_{t+1} = A\\mathbf{x}_t$ es:\n\n$$\\mathbf{x}_t = \\sum_{i=1}^{n} c_i \\lambda_i^t \\mathbf{v}_i$$\n\nEl comportamiento asintótico está dominado por el eigenvalor de mayor módulo $\\rho(A) = \\max_i|\\lambda_i|$ (radio espectral). Para funciones analíticas $f(z) = \\sum_k a_k z^k$, la extensión matricial es:\n\n$$f(A) = Pf(\\Lambda)P^{-1} = P\\,\\mathrm{diag}(f(\\lambda_1),\\ldots,f(\\lambda_n))P^{-1}$$\n\nCasos importantes: exponencial matricial $e^{tA}$ (sistemas EDO), $\\log A$, $A^{1/2}$ (raíz matricial)."
      },
      {
        label: "Diagonalización ortogonal y Teorema Espectral",
        body: "Para matrices **simétricas reales** ($A = A^\\top$), el Teorema Espectral garantiza una forma mucho más poderosa: la diagonalización es **ortogonal**, con $P = Q$ tal que $Q^\\top Q = QQ^\\top = I$:\n\n$$A = Q\\Lambda Q^\\top, \\qquad Q \\in \\mathcal{O}(n)$$\n\nEsto implica que $Q^{-1} = Q^\\top$, eliminando el costoso cómputo de la inversa. Además, los vectores propios de valores propios distintos son automáticamente ortogonales. La descomposición admite una representación como suma de proyecciones de rango 1 (descomposición espectral):\n\n$$A = \\sum_{i=1}^{n} \\lambda_i \\mathbf{q}_i \\mathbf{q}_i^\\top$$\n\ndonde cada $\\mathbf{q}_i \\mathbf{q}_i^\\top$ es la proyección ortogonal sobre la dirección $\\mathbf{q}_i$. Truncar esta suma a los $k$ mayores eigenvalores da la **mejor aproximación de rango $k$** en norma de Frobenius."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "La diagonalización y sus generalizaciones son el corazón de varios algoritmos fundamentales en ML:\n\n**PCA:** La matriz de covarianza $\\Sigma \\in \\mathbb{R}^{d \\times d}$ (simétrica semidefinida positiva) se diagonaliza ortogonalmente. Las $k$ componentes principales son las columnas de $Q_k$ (eigenvectores de los $k$ mayores eigenvalores), y la proyección de datos es $Z = XQ_k$. La varianza total retenida es $\\sum_{i=1}^k \\lambda_i / \\sum_{i=1}^d \\lambda_i$.\n\n**Análisis espectral de grafos (GNN):** La matriz laplaciana del grafo $L = D - W$ (simétrica semidefinida positiva) se diagonaliza como $L = U\\Lambda U^\\top$. Las convoluciones espectrales en grafos operan como $g_\\theta \\star \\mathbf{x} = Ug_\\theta(\\Lambda)U^\\top \\mathbf{x}$.\n\n**Optimización:** El Hessiano $H = \\nabla^2 \\mathcal{L}$ diagonalizado revela la geometría local de la pérdida. El número de condición $\\kappa = \\lambda_{\\max}/\\lambda_{\\min}$ determina la tasa de convergencia de gradient descent:\n\n$$\\text{error}_t \\leq \\left(\\frac{\\kappa - 1}{\\kappa + 1}\\right)^t \\text{error}_0$$\n\n**Compresión de redes:** La diagonalización aproximada de capas densas $W \\approx P\\Lambda P^{-1}$ (truncando pequeños eigenvalores) reduce parámetros con mínima pérdida de expresividad."
      },
    ],
    code: `import numpy as np
from numpy.linalg import eig, eigh, matrix_power, inv

# ─── 1. Diagonalización general A = P Λ P⁻¹ ────────────────────────────────
A = np.array([[5, 4, 2],
              [4, 5, 2],
              [2, 2, 2]], dtype=float)

eigenvalues, P = eig(A)
Lambda = np.diag(eigenvalues)
P_inv = inv(P)

# Verificación: A = P Λ P⁻¹
A_reconstructed = P @ Lambda @ P_inv
print("‖A - PΛP⁻¹‖ =", np.linalg.norm(A - A_reconstructed))  # ~0

# Verificación columna a columna: A·vᵢ = λᵢ·vᵢ
for i in range(len(eigenvalues)):
    residual = A @ P[:, i] - eigenvalues[i] * P[:, i]
    print(f"  ‖Av_{i} - λ_{i}v_{i}‖ = {np.linalg.norm(residual):.2e}")

# ─── 2. Potencias de matriz vía diagonalización ─────────────────────────────
def matrix_power_diag(P, Lambda_diag, P_inv, k):
    """A^k = P diag(λᵢ^k) P⁻¹  — O(n²) vs O(n³) de multiplicación directa."""
    return P @ np.diag(Lambda_diag ** k) @ P_inv

for k in [5, 10, 20]:
    A_k_diag   = matrix_power_diag(P, eigenvalues, P_inv, k)
    A_k_direct = matrix_power(A.astype(int), k).astype(float)
    err = np.linalg.norm(A_k_diag - A_k_direct)
    print(f"k={k:2d}: ‖A^k_diag - A^k_direct‖ = {err:.2e}")

# ─── 3. Exponencial matricial e^A = P diag(e^λᵢ) P⁻¹ ──────────────────────
from scipy.linalg import expm

A_exp_diag = P @ np.diag(np.exp(eigenvalues)) @ P_inv
A_exp_scipy = expm(A)
print("\\n‖e^A_diag - e^A_scipy‖ =", np.linalg.norm(A_exp_diag - A_exp_scipy))

# ─── 4. Diagonalización ortogonal (Teorema Espectral) ──────────────────────
# eigh garantiza: eigenvalores reales ordenados, Q ortonormal
eigenvalues_s, Q = eigh(A)  # A simétrica → usa rutina especializada
eigenvalues_s = eigenvalues_s[::-1]   # orden descendente
Q = Q[:, ::-1]

# Verificar ortonormalidad
print("\\nQ^T Q (debe ser I):\\n", np.round(Q.T @ Q, 10))

# Descomposición espectral: A = Σ λᵢ qᵢ qᵢᵀ
A_spectral = sum(l * np.outer(q, q)
                 for l, q in zip(eigenvalues_s, Q.T))
print("‖A - Σλᵢqᵢqᵢᵀ‖ =", np.linalg.norm(A - A_spectral))

# ─── 5. Aproximación de rango k (best rank-k en norma Frobenius) ────────────
print("\\n── Aproximación de rango k ──────────────────────────────────────────")
frob_total = np.linalg.norm(A, 'fro') ** 2
for k in range(1, len(eigenvalues_s) + 1):
    A_k = sum(eigenvalues_s[i] * np.outer(Q[:, i], Q[:, i]) for i in range(k))
    retained = sum(eigenvalues_s[:k] ** 2) / frob_total
    print(f"  Rango {k}: varianza retenida = {retained*100:.1f}%")

# ─── 6. Sistema dinámico x_{t+1} = A_norm · x_t ───────────────────────────
# Normalizar para convergencia (dividir entre ρ(A) + margen)
rho_A = max(abs(eigenvalues_s))
A_stable = A / (rho_A + 1.0)   # radio espectral < 1

eig_stable, P_stable = eig(A_stable)
P_inv_stable = inv(P_stable)

x0 = np.array([1.0, 0.0, 0.0])
c = P_inv_stable @ x0   # coordenadas en base propia

print("\\n── Sistema dinámico (50 pasos) ────────────────────────────────────────")
x_prev = x0.copy()
for t in [1, 5, 10, 50]:
    # Solución analítica: xₜ = Σ cᵢ λᵢᵗ vᵢ
    x_t = P_stable @ (c * eig_stable**t)
    print(f"  t={t:2d}: ‖xₜ‖ = {np.linalg.norm(x_t.real):.6f}")
`,
    related: [
      "Valores y Vectores Propios (Eigenvalues/Eigenvectors)",
      "Descomposición en Valores Singulares (SVD)",
      "Análisis de Componentes Principales (PCA)",
      "Forma Normal de Jordan",
      "Número de Condición y Estabilidad Numérica",
    ],
    hasViz: true,
    vizType: "diagonalizacion",
  },
  {
    id: 33,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Descomposición en Valores Singulares (SVD)",
    tags: ["SVD", "descomposición matricial", "valores singulares", "reducción de dimensionalidad", "PCA", "álgebra lineal numérica"],
    definition: "La Descomposición en Valores Singulares (SVD) factoriza cualquier matriz real A de dimensiones m×n en el producto A = UΣVᵀ, donde U y V son matrices ortogonales y Σ es diagonal con entradas no negativas llamadas valores singulares. A diferencia de la diagonalización espectral, la SVD existe para toda matriz, sea cuadrada o rectangular, singular o no. Los valores singulares cuantifican cuánto estira la transformación lineal en cada dirección singular, y su decaimiento revela la estructura de rango bajo subyacente en los datos.",
    formal: {
      notation: "Sea $A \\in \\mathbb{R}^{m \\times n}$ con $\\text{rank}(A) = r \\leq \\min(m,n)$",
      body: "A = U \\Sigma V^\\top, \\quad U \\in \\mathbb{R}^{m \\times m},\\; \\Sigma \\in \\mathbb{R}^{m \\times n},\\; V \\in \\mathbb{R}^{n \\times n}",
      geometric: "A\\mathbf{v}_i = \\sigma_i \\mathbf{u}_i, \\quad i = 1, \\ldots, r, \\qquad \\sigma_1 \\geq \\sigma_2 \\geq \\cdots \\geq \\sigma_r > 0 = \\sigma_{r+1} = \\cdots",
      properties: [
        "\\text{Ortonormalidad: } U^\\top U = I_m,\\quad V^\\top V = I_n",
        "\\text{Relación espectral: } \\sigma_i^2 = \\lambda_i(A^\\top A) = \\lambda_i(AA^\\top),\\quad \\mathbf{v}_i = \\text{eigenvec. de } A^\\top A,\\; \\mathbf{u}_i = \\text{eigenvec. de } AA^\\top",
        "\\text{Norma de Frobenius: } \\|A\\|_F^2 = \\sum_{i=1}^{r} \\sigma_i^2",
        "\\text{Norma espectral: } \\|A\\|_2 = \\sigma_1",
        "\\text{Aproximación óptima (Eckart–Young): } \\underset{\\text{rank}(B)=k}{\\arg\\min}\\|A - B\\|_F = U_k \\Sigma_k V_k^\\top = \\sum_{i=1}^{k} \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^\\top",
      ],
    },
    intuition: "Toda transformación lineal $A$ puede entenderse como tres movimientos geométricos sucesivos: primero una rotación/reflexión en el espacio de entrada ($V^\\top$), luego un estiramiento anisótropo a lo largo de los ejes coordenados ($\\Sigma$), y finalmente otra rotación/reflexión en el espacio de salida ($U$). Los valores singulares $\\sigma_i$ son los factores de escala de ese estiramiento. Si los $\\sigma_i$ decaen rápido, la mayor parte de la 'energía' de la transformación vive en pocas dimensiones: la matriz tiene estructura de rango bajo y puede comprimirse sin perder casi información.",
    development: [
      {
        label: "Existencia y construcción",
        body: "La SVD existe para toda $A \\in \\mathbb{R}^{m \\times n}$. La construcción parte de $A^\\top A \\in \\mathbb{R}^{n \\times n}$, que es simétrica semidefinida positiva, por lo que admite diagonalización espectral:\n\n$$A^\\top A = V \\Lambda V^\\top, \\quad \\Lambda = \\text{diag}(\\lambda_1, \\ldots, \\lambda_n),\\quad \\lambda_i \\geq 0$$\n\nSe definen $\\sigma_i = \\sqrt{\\lambda_i}$ y los vectores singulares izquierdos como $\\mathbf{u}_i = \\frac{1}{\\sigma_i} A \\mathbf{v}_i$ para $i \\leq r$, completando $U$ con una base ortonormal del complemento. La SVD delgada (thin/economy) retiene solo las $r$ columnas no nulas:\n\n$$A = U_r \\Sigma_r V_r^\\top = \\sum_{i=1}^{r} \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^\\top$$\n\ncada término $\\sigma_i \\mathbf{u}_i \\mathbf{v}_i^\\top$ es una matriz de rango 1 que contribuye con 'peso' $\\sigma_i$."
      },
      {
        label: "Teorema de Eckart–Young y aproximación de rango bajo",
        body: "El teorema de Eckart–Young–Mirsky (1936) establece que la mejor aproximación de rango $k < r$ de $A$ en norma de Frobenius y en norma espectral es la SVD truncada:\n\n$$A_k = \\sum_{i=1}^{k} \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^\\top$$\n\ncon errores:\n\n$$\\|A - A_k\\|_F^2 = \\sum_{i=k+1}^{r} \\sigma_i^2, \\qquad \\|A - A_k\\|_2 = \\sigma_{k+1}$$\n\nEsto justifica usar la SVD como herramienta de compresión: si $\\sum_{i=1}^{k} \\sigma_i^2 / \\sum_{i=1}^{r} \\sigma_i^2 \\geq 0.99$, entonces $A_k$ captura el 99% de la varianza con solo $k(m+n+1)$ números en lugar de $mn$."
      },
      {
        label: "Cuatro subespacios fundamentales",
        body: "La SVD exhibe explícitamente los cuatro subespacios fundamentales de $A$ (Teorema de Strang):\n\n$$\\text{Col}(A) = \\text{span}\\{\\mathbf{u}_1, \\ldots, \\mathbf{u}_r\\}$$\n\n$$\\text{Nul}(A) = \\text{span}\\{\\mathbf{v}_{r+1}, \\ldots, \\mathbf{v}_n\\}$$\n\n$$\\text{Row}(A) = \\text{span}\\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_r\\}$$\n\n$$\\text{Nul}(A^\\top) = \\text{span}\\{\\mathbf{u}_{r+1}, \\ldots, \\mathbf{u}_m\\}$$\n\nAdicionalmente, la pseudoinversa de Moore–Penrose se obtiene directamente como $A^+ = V \\Sigma^+ U^\\top$, donde $\\Sigma^+$ invierte los valores singulares no nulos, dando la solución de mínima norma al sistema $\\min \\|A\\mathbf{x} - \\mathbf{b}\\|_2$."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "La SVD es ubicua en ML. **PCA** es SVD de la matriz de datos centrada: los vectores singulares derechos $\\mathbf{v}_i$ son las componentes principales y $\\sigma_i^2/(m-1)$ las varianzas explicadas.\n\n**Sistemas de recomendación** (Netflix Prize): factorizar la matriz usuario–ítem $R \\approx U_k \\Sigma_k V_k^\\top$ para imputar entradas faltantes y descubrir factores latentes.\n\n**NLP clásico**: LSA (Latent Semantic Analysis) aplica SVD a la matriz TF-IDF para capturar semántica latente.\n\nEn **Deep Learning**, la SVD aparece en:\n- *Inicialización ortogonal* de pesos via $U$ o $V$\n- *Compresión de capas* lineales: $W \\approx U_k \\Sigma_k V_k^\\top$ reduce parámetros\n- *LoRA* (Low-Rank Adaptation): fine-tuning eficiente que aprende $\\Delta W = BA$ con $\\text{rank}(\\Delta W) \\ll \\min(m,n)$, motivado exactamente por el teorema de Eckart–Young\n- *Análisis de estabilidad*: $\\sigma_1(W)$ (norma espectral) se usa como regularizador (spectral normalization en GANs)"
      },
    ],
    code: `# Python - Descomposición SVD y aproximación de rango bajo
  import numpy as np
  import matplotlib.pyplot as plt
  
  # ── 1. SVD completa y delgada ──────────────────────────────────────────────
  np.random.seed(42)
  m, n = 6, 4
  A = np.random.randn(m, n)
  
  # SVD completa: U (m×m), S (valores singulares), Vt (n×n)
  U, S, Vt = np.linalg.svd(A, full_matrices=True)
  print("Valores singulares:", np.round(S, 4))
  print("Rango numérico:", np.sum(S > 1e-10))
  
  # Reconstrucción exacta
  Sigma = np.zeros((m, n))
  np.fill_diagonal(Sigma, S)
  A_reconstructed = U @ Sigma @ Vt
  print("Error de reconstrucción:", np.linalg.norm(A - A_reconstructed))
  
  # ── 2. SVD delgada (economy) ───────────────────────────────────────────────
  U_thin, S_thin, Vt_thin = np.linalg.svd(A, full_matrices=False)
  # U_thin: (m×r), S_thin: (r,), Vt_thin: (r×n)  — más eficiente en memoria
  
  # ── 3. Aproximación de rango k (Eckart–Young) ─────────────────────────────
  def svd_rank_k(A, k):
      """Mejor aproximación de rango k en norma Frobenius."""
      U, S, Vt = np.linalg.svd(A, full_matrices=False)
      # Retener solo los k primeros valores singulares
      return U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
  
  def varianza_explicada(S, k):
      return np.sum(S[:k]**2) / np.sum(S**2)
  
  for k in range(1, len(S_thin) + 1):
      Ak = svd_rank_k(A, k)
      err = np.linalg.norm(A - Ak, 'fro')
      var = varianza_explicada(S_thin, k)
      print(f"k={k}: ||A-A_k||_F={err:.4f}, varianza explicada={var:.2%}")
  
  # ── 4. Pseudoinversa de Moore–Penrose ─────────────────────────────────────
  # A^+ = V Σ^+ U^T  (scipy o numpy)
  A_pinv = np.linalg.pinv(A)  # equivalente a la SVD con inversión de σ_i > tol
  
  # Solución de mínima norma: min ||x||₂  s.t.  Ax ≈ b
  b = np.random.randn(m)
  x_minnorm = A_pinv @ b
  print("Solución mínima norma ||x||:", np.round(np.linalg.norm(x_minnorm), 4))
  
  # ── 5. Compresión de imagen (ejemplo con matriz sintética de rango bajo) ──
  # Simular imagen 50×80 de rango bajo real = 5
  rank_true = 5
  Image = (np.random.randn(50, rank_true) @ np.random.randn(rank_true, 80)
           + 0.5 * np.random.randn(50, 80))  # señal + ruido
  
  U_img, S_img, Vt_img = np.linalg.svd(Image, full_matrices=False)
  
  for k in [1, 3, 5, 10]:
      Ik = svd_rank_k(Image, k)
      ve = varianza_explicada(S_img, k)
      cost_ratio = k * (50 + 80 + 1) / (50 * 80)
      print(f"k={k:2d}: varianza={ve:.1%}, compresión={cost_ratio:.1%} del original")
  `,
    related: ["Eigenvalues/Eigenvectors", "PCA", "Descomposición QR", "Pseudoinversa de Moore–Penrose", "LoRA", "Normas matriciales"],
    hasViz: true,
    vizType: "svdTransform",
  },
  {
    id: 34,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "PCA (Análisis de Componentes Principales)",
    tags: ["PCA", "reducción de dimensionalidad", "varianza explicada", "componentes principales", "SVD", "covarianza"],
    definition: "El Análisis de Componentes Principales (PCA) es una transformación lineal ortogonal que proyecta un conjunto de datos en un nuevo sistema de coordenadas donde las direcciones de máxima varianza —llamadas componentes principales— quedan ordenadas de mayor a menor. Formalmente, PCA diagonaliza la matriz de covarianza empírica, encontrando la base ortonormal que desacopla las correlaciones lineales entre variables. La proyección sobre los primeros k componentes constituye la mejor aproximación afín de rango k a los datos en el sentido de mínimo error cuadrático medio, equivalente al teorema de Eckart–Young aplicado a la matriz de datos centrada.",
    formal: {
      notation: "Sea $\\mathbf{X} \\in \\mathbb{R}^{n \\times p}$ la matriz de datos centrada ($\\mathbf{1}^\\top \\mathbf{X} = \\mathbf{0}$), con $n$ observaciones y $p$ variables",
      body: "\\hat{\\Sigma} = \\frac{1}{n-1} \\mathbf{X}^\\top \\mathbf{X} = V \\Lambda V^\\top, \\quad \\lambda_1 \\geq \\lambda_2 \\geq \\cdots \\geq \\lambda_p \\geq 0",
      geometric: "\\mathbf{X} = U \\Sigma V^\\top \\implies \\hat{\\Sigma} = \\frac{1}{n-1} V \\Sigma^2 V^\\top, \\quad \\lambda_i = \\frac{\\sigma_i^2}{n-1}",
      properties: [
        "\\text{Componentes principales: } \\mathbf{z}_i = \\mathbf{X} \\mathbf{v}_i \\in \\mathbb{R}^n,\\quad \\text{Var}(\\mathbf{z}_i) = \\lambda_i",
        "\\text{Ortogonalidad de scores: } \\mathbf{z}_i^\\top \\mathbf{z}_j = 0 \\text{ para } i \\neq j",
        "\\text{Varianza total preservada: } \\sum_{i=1}^{p} \\lambda_i = \\text{tr}(\\hat{\\Sigma}) = \\sum_{j=1}^{p} \\text{Var}(X_j)",
        "\\text{Varianza explicada por } k \\text{ componentes: } \\text{VE}(k) = \\frac{\\sum_{i=1}^{k} \\lambda_i}{\\sum_{i=1}^{p} \\lambda_i}",
        "\\text{Reconstrucción óptima: } \\hat{\\mathbf{X}}_k = \\mathbf{Z}_k V_k^\\top = \\sum_{i=1}^{k} \\mathbf{z}_i \\mathbf{v}_i^\\top,\\quad \\|\\mathbf{X} - \\hat{\\mathbf{X}}_k\\|_F^2 = (n-1)\\sum_{i=k+1}^{p} \\lambda_i",
      ],
    },
    intuition: "Imagina una nube de puntos en 3D con forma de disco inclinado: casi toda la variación ocurre dentro del plano del disco, y muy poca en la dirección perpendicular. PCA encuentra automáticamente ese plano —sin que se lo digas— buscando la dirección que maximiza la dispersión proyectada. El primer componente es el 'eje mayor' de la elipsoide de datos, el segundo el 'eje menor' ortogonal, y así sucesivamente. Proyectar sobre los primeros $k$ componentes es como aplanar el disco sobre su plano natural: se pierde la dimensión de 'grosor' (poca varianza) pero se conserva la estructura esencial.",
    development: [
      {
        label: "Derivación variacional: maximización de varianza",
        body: "El primer componente principal $\\mathbf{v}_1$ resuelve el problema de optimización con restricción:\n\n$$\\mathbf{v}_1 = \\underset{\\|\\mathbf{v}\\|=1}{\\arg\\max}\\; \\mathbf{v}^\\top \\hat{\\Sigma} \\mathbf{v}$$\n\nPor multiplicadores de Lagrange: $\\hat{\\Sigma} \\mathbf{v} = \\lambda \\mathbf{v}$, lo que muestra que $\\mathbf{v}_1$ es el eigenvector de $\\hat{\\Sigma}$ asociado al mayor eigenvalor $\\lambda_1$. El valor óptimo de la varianza proyectada es exactamente $\\lambda_1$.\n\nEl $k$-ésimo componente se obtiene maximizando la varianza en el subespacio ortogonal a $\\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_{k-1}\\}$ (deflación de Hotelling), lo que produce secuencialmente los eigenvalores $\\lambda_1 \\geq \\cdots \\geq \\lambda_p$."
      },
      {
        label: "PCA vía SVD y equivalencia exacta",
        body: "En la práctica, PCA se implementa mediante SVD de $\\mathbf{X}$ (no de $\\hat{\\Sigma}$), lo cual es numéricamente más estable:\n\n$$\\mathbf{X} = U \\Sigma V^\\top \\implies \\hat{\\Sigma} = \\frac{\\Sigma^2}{n-1},\\quad \\mathbf{v}_i = \\text{columna } i \\text{ de } V$$\n\nLos **scores** (coordenadas en el nuevo sistema) son:\n\n$$\\mathbf{Z} = \\mathbf{X} V = U \\Sigma$$\n\nde modo que la $i$-ésima columna de $U$ da las coordenadas normalizadas de los $n$ puntos sobre el $i$-ésimo componente. Esto evita formar $\\mathbf{X}^\\top \\mathbf{X}$ explícitamente, reduciendo error numérico cuando $p$ es grande."
      },
      {
        label: "Selección de k: varianza explicada y scree plot",
        body: "La proporción de varianza explicada (PVE) por los primeros $k$ componentes es:\n\n$$\\text{PVE}(k) = \\frac{\\sum_{i=1}^{k} \\sigma_i^2}{\\sum_{i=1}^{p} \\sigma_i^2}$$\n\nCriterios prácticos para elegir $k$:\n\n- **Umbral de varianza**: retener $k$ tal que $\\text{PVE}(k) \\geq 0.90$\n- **Scree plot**: graficar $\\sigma_i^2$ vs. $i$ y buscar el 'codo' (elbow) donde la curva se aplana\n- **Kaiser**: retener componentes con $\\lambda_i > 1$ (si los datos están estandarizados)\n- **CV**: validación cruzada minimizando error de reconstrucción out-of-sample\n\nEl error de reconstrucción cuadrático medio para $k$ componentes es:\n\n$$\\text{RMSE}_k = \\sqrt{\\frac{1}{np}\\sum_{i=k+1}^{p} \\sigma_i^2} = \\sqrt{\\frac{(n-1)}{np}\\sum_{i=k+1}^{p} \\lambda_i}$$"
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "PCA es uno de los algoritmos más influyentes en ML. Sus conexiones principales:\n\n**Preprocesamiento**: PCA whitening transforma los scores como $\\tilde{\\mathbf{Z}} = \\mathbf{Z} \\Lambda^{-1/2}$, produciendo componentes con varianza unitaria. Esto precondiona optimizadores (SGD converge más rápido en superficies isotrópicas).\n\n**Eigenfaces (Turk & Pentland, 1991)**: PCA sobre imágenes de rostros $p = 64{\\times}64 = 4096$ píxeles produce una base de 'caras propias'; la proyección sobre los primeros $k \\approx 50$ es suficiente para reconocimiento.\n\n**Kernel PCA**: reemplaza $\\mathbf{X}\\mathbf{X}^\\top$ por una matriz kernel $K_{ij} = \\kappa(\\mathbf{x}_i, \\mathbf{x}_j)$, extendiendo PCA a manifolds no lineales.\n\n**Autoencoder lineal**: un autoencoder con una capa oculta lineal y función de pérdida MSE aprende exactamente el subespacio de PCA (los pesos del encoder convergen al espacio generado por $V_k$), lo que motiva arquitecturas no lineales como VAE.\n\n**PCA incremental / randomizado**: para $n, p$ masivos, algoritmos como SVD randomizada (Halko et al., 2011) calculan la SVD truncada de rango $k$ en $O(npk)$ en lugar de $O(np\\min(n,p))$, esencial en LLMs para compresión de matrices de atención."
      },
    ],
    code: `# Python - PCA desde cero y con scikit-learn
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

np.random.seed(0)

# ── 1. Generar datos con estructura de covarianza conocida ────────────────
n, p = 200, 3
# Covarianza: correlación fuerte entre x1-x2, x3 independiente
cov_true = np.array([[3.0, 2.4, 0.0],
                     [2.4, 2.0, 0.0],
                     [0.0, 0.0, 0.5]])
X_raw = np.random.multivariate_normal(mean=[0, 0, 0], cov=cov_true, size=n)

# ── 2. Centrar (y opcionalmente estandarizar) ─────────────────────────────
scaler = StandardScaler(with_std=False)   # solo centrar, no escalar
X = scaler.fit_transform(X_raw)

# ── 3. PCA desde cero vía SVD ─────────────────────────────────────────────
U, S, Vt = np.linalg.svd(X, full_matrices=False)
eigenvalues = S**2 / (n - 1)             # λ_i = σ_i² / (n-1)
loadings    = Vt.T                        # columnas = eigenvectores de Σ̂
scores      = X @ loadings               # Z = X V  (coordenadas en PC-space)

pve = eigenvalues / eigenvalues.sum()     # proporción de varianza explicada
print("Eigenvalores:", np.round(eigenvalues, 4))
print("PVE:         ", np.round(pve, 4))
print("PVE acumulada:", np.round(np.cumsum(pve), 4))

# ── 4. Verificar con sklearn ──────────────────────────────────────────────
pca = PCA(n_components=p)
pca.fit(X)
print("\\nEigenvalores sklearn:", np.round(pca.explained_variance_, 4))
# Nota: los signos de los loadings pueden diferir (convención arbitraria)

# ── 5. Proyección a k=2 componentes y reconstrucción ─────────────────────
k = 2
Z_k   = scores[:, :k]                    # scores reducidos  (n × k)
X_hat = Z_k @ loadings[:, :k].T          # reconstrucción    (n × p)
rmse  = np.sqrt(np.mean((X - X_hat)**2))
print(f"\\nRMSE reconstrucción (k={k}): {rmse:.4f}")
print(f"Varianza explicada acumulada k={k}: {pve[:k].sum():.2%}")

# ── 6. Scree plot ─────────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(10, 4))

axes[0].bar(range(1, p+1), eigenvalues, color="#60a5fa", alpha=0.8)
axes[0].set(title="Scree plot", xlabel="Componente", ylabel="Eigenvalor λᵢ")
axes[0].plot(range(1, p+1), eigenvalues, 'o-', color="#f87171")

axes[1].plot(range(1, p+1), np.cumsum(pve), 's-', color="#34d399", linewidth=2)
axes[1].axhline(0.90, color="#fbbf24", linestyle="--", label="90%")
axes[1].set(title="Varianza explicada acumulada",
            xlabel="k componentes", ylabel="PVE acumulada", ylim=(0, 1.05))
axes[1].legend()
plt.tight_layout(); plt.show()

# ── 7. PCA incremental para datos grandes ─────────────────────────────────
from sklearn.decomposition import IncrementalPCA

ipca = IncrementalPCA(n_components=2, batch_size=50)
Z_incremental = ipca.fit_transform(X)    # procesa en mini-batches
print("\\nIncrementalPCA eigenvalores:", np.round(ipca.explained_variance_, 4))
`,
    related: ["SVD", "Eigenvalues/Eigenvectors", "Kernel PCA", "Autoencoder", "t-SNE / UMAP", "Whitening"],
    hasViz: true,
    vizType: "pcaExplorer",
  },
  {
    id: 35,
    section: "Álgebra Lineal: La Estructura de los Datos",
    sectionCode: "II",
    name: "Tensores y Operaciones Tensoriales",
    tags: ["tensores", "producto tensorial", "contracción", "broadcasting", "reshape", "deep learning"],
    definition: "Un tensor es un arreglo multidimensional de números reales que generaliza escalares (orden 0), vectores (orden 1) y matrices (orden 2) a órdenes arbitrarios. Formalmente, un tensor de orden k sobre espacios vectoriales V₁,…,Vₖ es un elemento del producto tensorial V₁⊗⋯⊗Vₖ, identificable con un arreglo de componentes indexado por k índices. En el contexto computacional de ML y DL, los tensores son el objeto de datos fundamental: imágenes, secuencias, batches y pesos de redes neuronales se representan y manipulan como tensores mediante operaciones de contracción, producto exterior, reshape y broadcasting.",
    formal: {
      notation: "Sea $\\mathcal{T} \\in \\mathbb{R}^{d_1 \\times d_2 \\times \\cdots \\times d_k}$ un tensor de orden $k$ y forma $(d_1, d_2, \\ldots, d_k)$",
      body: "\\mathcal{T}_{i_1 i_2 \\cdots i_k} \\in \\mathbb{R}, \\quad 1 \\leq i_j \\leq d_j,\\quad j = 1,\\ldots,k, \\qquad |\\mathcal{T}| = \\prod_{j=1}^{k} d_j \\text{ elementos}",
      geometric: "(\\mathcal{A} \\otimes \\mathcal{B})_{i_1 \\cdots i_p j_1 \\cdots j_q} = \\mathcal{A}_{i_1 \\cdots i_p} \\cdot \\mathcal{B}_{j_1 \\cdots j_q}, \\qquad \\mathcal{A} \\in \\mathbb{R}^{d_1 \\cdots d_p},\\; \\mathcal{B} \\in \\mathbb{R}^{e_1 \\cdots e_q}",
      properties: [
        "\\text{Contracción sobre índice } \\ell:\\; (\\mathcal{A} \\cdot_\\ell \\mathcal{B})_{\\ldots} = \\sum_{i_\\ell=1}^{d_\\ell} \\mathcal{A}_{\\ldots i_\\ell \\ldots} \\cdot \\mathcal{B}_{\\ldots i_\\ell \\ldots},\\quad d_\\ell \\text{ debe coincidir}",
        "\\text{Norma de Frobenius: } \\|\\mathcal{T}\\|_F = \\sqrt{\\sum_{i_1,\\ldots,i_k} \\mathcal{T}_{i_1 \\cdots i_k}^2}",
        "\\text{Reshape (no copia datos): } \\mathcal{T} \\in \\mathbb{R}^{d_1 \\times \\cdots \\times d_k} \\cong \\mathbb{R}^{e_1 \\times \\cdots \\times e_m} \\iff \\prod d_j = \\prod e_i",
        "\\text{Modo-}n\\text{ unfolding: } \\mathcal{T}_{(n)} \\in \\mathbb{R}^{d_n \\times (d_1 \\cdots \\hat{d}_n \\cdots d_k)},\\text{ matricización a lo largo del eje }n",
        "\\text{Einstein summation: } C_{ik} = \\sum_j A_{ij} B_{jk} \\equiv \\texttt{einsum('ij,jk->ik', A, B)}",
      ],
    },
    intuition: "Un escalar es un punto, un vector es una fila de números, una matriz es una tabla. Un tensor de orden 3 es un cubo de números —piensa en una imagen RGB: alto × ancho × 3 canales—. Orden 4 agrega el batch: $N$ imágenes forman un hipercubo $N \\times H \\times W \\times C$. Las operaciones tensoriales son generalizaciones de la multiplicación matricial donde se especifica explícitamente qué índices 'se suman' (contraen) y cuáles 'se mantienen libres', usando la notación de Einstein como lenguaje universal.",
    development: [
      {
        label: "Producto tensorial y contracción",
        body: "El **producto exterior** (outer product) de dos vectores $\\mathbf{u} \\in \\mathbb{R}^m$, $\\mathbf{v} \\in \\mathbb{R}^n$ produce una matriz de rango 1:\n\n$$\\mathbf{u} \\otimes \\mathbf{v} = \\mathbf{u}\\mathbf{v}^\\top \\in \\mathbb{R}^{m \\times n}, \\quad (\\mathbf{u} \\otimes \\mathbf{v})_{ij} = u_i v_j$$\n\nGeneralizando, el producto exterior de $k$ vectores produce un tensor de orden $k$ de rango 1. Todo tensor puede expresarse como suma de tensores de rango 1 (descomposición CP).\n\nLa **contracción** es la operación dual: suma sobre uno o más índices compartidos. La multiplicación matricial $C = AB$ es una contracción sobre el índice interior:\n\n$$C_{ik} = \\sum_j A_{ij} B_{jk} \\equiv \\texttt{einsum('ij,jk->ik')}$$\n\nEl producto punto es contracción total: $\\mathbf{u} \\cdot \\mathbf{v} = \\sum_i u_i v_i \\equiv \\texttt{einsum('i,i->')}$."
      },
      {
        label: "Notación de Einstein y einsum",
        body: "La **convención de suma de Einstein** suprime el símbolo $\\sum$: todo índice que aparece exactamente dos veces en un producto se contrae automáticamente. La función `einsum` implementa esto de forma general:\n\n$$\\texttt{einsum('bij,bjk->bik', A, B)}$$\n\nrealiza multiplicación matricial en batch: $b$ matrices $A_b \\in \\mathbb{R}^{i \\times j}$ por $B_b \\in \\mathbb{R}^{j \\times k}$, produciendo $C_b \\in \\mathbb{R}^{i \\times k}$. El índice $b$ es libre (no se contrae), $j$ es el índice de contracción.\n\nOperaciones comunes como trazas, productos externos, convoluciones y la atención multi-cabeza de los Transformers se expresan limpiamente con einsum:\n\n$$\\text{Atención: } \\texttt{einsum('bhqd,bhkd->bhqk', Q, K)} \\cdot \\frac{1}{\\sqrt{d}}$$\n\ndonde $b$=batch, $h$=heads, $q$=queries, $k$=keys, $d$=dimensión."
      },
      {
        label: "Reshape, broadcasting y memoria",
        body: "**Reshape** reorganiza los elementos de un tensor sin copiarlos (vista sobre el mismo buffer de memoria), siempre que el número total de elementos se conserve:\n\n$$\\mathcal{T} \\in \\mathbb{R}^{32 \\times 28 \\times 28} \\xrightarrow{\\text{reshape}} \\mathbb{R}^{32 \\times 784}$$\n\nEl orden de almacenamiento (row-major C vs column-major Fortran) determina cuándo reshape es una vista vs. una copia.\n\n**Broadcasting** permite operar tensores de formas incompatibles expandiendo implícitamente dimensiones de tamaño 1:\n\n$$\\mathbb{R}^{32 \\times 784} + \\mathbb{R}^{784} \\to \\mathbb{R}^{32 \\times 784}$$\n\nLas reglas de broadcasting (NumPy/PyTorch): alinear formas por la derecha, cada dimensión debe ser igual, 1, o inexistente. Broadcasting evita copias explícitas pero puede generar tensores intermedios grandes; en GPUs, la gestión de memoria es crítica para evitar OOM.\n\nLa **traza** y el **modo-n unfolding** $\\mathcal{T}_{(n)}$ matricizan el tensor a lo largo del eje $n$, habilitando aplicar SVD o álgebra matricial estándar a cada modo."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "Los tensores son el sustrato computacional de todo el Deep Learning moderno:\n\n**Convolución 2D** es una contracción parcial: para entrada $\\mathcal{X} \\in \\mathbb{R}^{B \\times C_{in} \\times H \\times W}$ y kernel $\\mathcal{W} \\in \\mathbb{R}^{C_{out} \\times C_{in} \\times k_H \\times k_W}$:\n\n$$\\mathcal{Y}_{b,c_{out},h,w} = \\sum_{c_{in},i,j} \\mathcal{W}_{c_{out},c_{in},i,j} \\cdot \\mathcal{X}_{b,c_{in},h+i,w+j}$$\n\n**Atención multi-cabeza (Transformers)**: los tensores $Q, K, V \\in \\mathbb{R}^{B \\times H \\times T \\times d_k}$ se contraen con einsum, y el resultado se transpone y reshape antes de la proyección final.\n\n**Descomposición tensorial**: Tucker y CP decomposition comprimen capas de redes: una capa Conv4D se factoriza en convoluciones de menor rango, reduciendo FLOPs sin gran pérdida de accuracy.\n\n**Paralelismo de modelos**: en LLMs con billones de parámetros, los tensores de pesos se fragmentan (shard) a lo largo de distintas dimensiones entre GPUs (tensor parallelism), haciendo que la semántica de ejes del tensor sea fundamental para la correctitud del entrenamiento distribuido."
      },
    ],
    code: `# Python - Tensores y operaciones tensoriales con NumPy y PyTorch
import numpy as np
import torch

# ── 1. Creación y propiedades básicas ────────────────────────────────────
T = np.random.randn(4, 3, 5)          # tensor orden 3
print(f"Forma: {T.shape}, Orden: {T.ndim}, Elementos: {T.size}")
print(f"Norma Frobenius: {np.linalg.norm(T):.4f}")

# ── 2. Producto exterior (outer product) ──────────────────────────────────
u = np.array([1.0, 2.0, 3.0])
v = np.array([0.5, 1.0])
w = np.array([1.0, -1.0, 2.0, 0.0])
# Tensor de rango 1 de orden 3
T_rank1 = np.einsum('i,j,k->ijk', u, v, w)  # shape (3, 2, 4)
print(f"Tensor rango 1: {T_rank1.shape}")

# ── 3. Notación de Einstein — operaciones comunes ─────────────────────────
A = np.random.randn(4, 5)
B = np.random.randn(5, 3)
C = np.random.randn(4, 4)

# Multiplicación matricial
AB   = np.einsum('ij,jk->ik', A, B)          # (4,3)
# Traza
trC  = np.einsum('ii->', C)                   # escalar
# Producto hadamard (elemento a elemento)
D    = np.random.randn(4, 5)
HD   = np.einsum('ij,ij->ij', A, D)          # (4,5)
# Producto exterior de vectores
outer = np.einsum('i,j->ij', u, u)           # (3,3)

print(f"AB shape: {AB.shape}, traza C: {trC:.4f}")

# ── 4. Batch matmul con einsum ────────────────────────────────────────────
batch = 8
Ab = np.random.randn(batch, 4, 5)
Bb = np.random.randn(batch, 5, 3)
Cb = np.einsum('bij,bjk->bik', Ab, Bb)       # (8, 4, 3)
print(f"Batch matmul: {Cb.shape}")

# Equivalente con np.matmul / @ operator:
Cb2 = Ab @ Bb
print(f"Diferencia: {np.max(np.abs(Cb - Cb2)):.2e}")  # ~0

# ── 5. Reshape y vistas de memoria ────────────────────────────────────────
X = np.random.randn(32, 28, 28)               # batch de imágenes grayscale
X_flat = X.reshape(32, -1)                    # (32, 784) — vista, sin copia
print(f"¿Comparten memoria? {np.shares_memory(X, X_flat)}")  # True

# Transpose cambia strides, puede requerir contiguous() en PyTorch
Xt = X.transpose(0, 2, 1)                    # (32, 28, 28) — vista diferente

# ── 6. Broadcasting ───────────────────────────────────────────────────────
batch_vecs = np.random.randn(32, 784)         # (32, 784)
bias       = np.random.randn(784)             # (784,)
result     = batch_vecs + bias                # broadcasting → (32, 784)

# Normalización por batch (broadcasting avanzado)
mean = batch_vecs.mean(axis=0, keepdims=True) # (1, 784)
std  = batch_vecs.std(axis=0,  keepdims=True) # (1, 784)
X_norm = (batch_vecs - mean) / (std + 1e-8)  # (32, 784)

# ── 7. Modo-n unfolding (matricización) ──────────────────────────────────
def unfold(tensor, mode):
    """Matricización del tensor a lo largo del modo n."""
    ndim  = tensor.ndim
    shape = tensor.shape
    order = [mode] + [i for i in range(ndim) if i != mode]
    return tensor.transpose(order).reshape(shape[mode], -1)

T3 = np.random.randn(4, 5, 6)
T3_0 = unfold(T3, 0)   # (4, 30)
T3_1 = unfold(T3, 1)   # (5, 24)
T3_2 = unfold(T3, 2)   # (6, 20)
print(f"Unfoldings: {T3_0.shape}, {T3_1.shape}, {T3_2.shape}")

# ── 8. PyTorch: tensores en GPU y autograd ────────────────────────────────
device = 'cuda' if torch.cuda.is_available() else 'cpu'
Qt = torch.randn(2, 4, 8, 16, device=device)  # (B, H, T, d_k)
Kt = torch.randn(2, 4, 8, 16, device=device)

# Atención: scores = Q K^T / sqrt(d_k)
scores = torch.einsum('bhqd,bhkd->bhqk', Qt, Kt) / (16 ** 0.5)
print(f"Attention scores shape: {scores.shape}")  # (2, 4, 8, 8)
`,
    related: ["SVD", "Producto Matricial", "Convolución", "Mecanismo de Atención", "Broadcasting", "Descomposición CP/Tucker"],
    hasViz: true,
    vizType: "tensorOps",
  },
  {
    id: 36,
    section: "Cálculo y Optimización: El Motor de Aprendizaje",
    sectionCode: "III",
    name: "Derivada y Reglas de Derivación",
    tags: ["derivada", "diferenciación", "regla de la cadena", "gradiente", "cálculo", "backpropagation"],
    definition: "La derivada de una función f en un punto x mide la tasa de cambio instantánea de f respecto a x, definida como el límite del cociente diferencial cuando el incremento tiende a cero. Geométricamente, es la pendiente de la recta tangente a la gráfica de f en ese punto. Las reglas de derivación —producto, cociente, cadena— permiten calcular derivadas de funciones compuestas de forma sistemática sin recurrir directamente a la definición límite. En ML y DL, la regla de la cadena es el fundamento matemático del algoritmo de backpropagation, que propaga gradientes a través de grafos computacionales arbitrariamente profundos.",
    formal: {
      notation: "Sea $f : \\mathbb{R} \\to \\mathbb{R}$ diferenciable en $x_0 \\in \\mathbb{R}$",
      body: "f'(x_0) = \\lim_{h \\to 0} \\frac{f(x_0 + h) - f(x_0)}{h} = \\lim_{\\Delta x \\to 0} \\frac{\\Delta f}{\\Delta x}",
      geometric: "f(x) \\approx f(x_0) + f'(x_0)(x - x_0) + \\frac{f''(x_0)}{2}(x-x_0)^2 + \\cdots \\quad \\text{(Taylor)}",
      properties: [
        "\\text{Linealidad: } (\\alpha f + \\beta g)' = \\alpha f' + \\beta g'",
        "\\text{Producto: } (fg)' = f'g + fg'",
        "\\text{Cociente: } \\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}, \\quad g \\neq 0",
        "\\text{Cadena: } (f \\circ g)'(x) = f'(g(x)) \\cdot g'(x), \\quad \\frac{dz}{dx} = \\frac{dz}{dy}\\cdot\\frac{dy}{dx}",
        "\\text{Inversa: } (f^{-1})'(y) = \\frac{1}{f'(f^{-1}(y))}, \\quad \\text{donde } f'(f^{-1}(y)) \\neq 0",
      ],
    },
    intuition: "Imagina que conduces por una carretera montañosa y tu altímetro marca $f(x)$ metros a $x$ km del origen. La derivada $f'(x)$ es exactamente lo que marca el inclinómetro en ese instante: cuántos metros subes por cada km adicional. Si $f'(x) > 0$ vas subiendo, si $f'(x) < 0$ bajando, si $f'(x) = 0$ estás en un pico, valle o meseta. La regla de la cadena dice: si el camino depende del tiempo a través de tu velocidad, la tasa de cambio de altitud respecto al tiempo es el producto de la pendiente del terreno por tu velocidad en ese punto.",
    development: [
      {
        label: "Definición límite y diferenciabilidad",
        body: "La derivada existe en $x_0$ si y solo si el límite lateral izquierdo y derecho del cociente diferencial coinciden:\n\n$$f'(x_0) = \\lim_{h \\to 0^+} \\frac{f(x_0+h)-f(x_0)}{h} = \\lim_{h \\to 0^-} \\frac{f(x_0+h)-f(x_0)}{h}$$\n\nDiferenciabilidad implica continuidad, pero no al revés. El contraejemplo canónico es $f(x) = |x|$ en $x=0$: continua pero no diferenciable (límites laterales $+1$ y $-1$).\n\nLa **aproximación de primer orden** (linealización):\n\n$$f(x_0 + h) \\approx f(x_0) + f'(x_0) \\cdot h + O(h^2)$$\n\nes el fundamento del descenso de gradiente: si $h = -\\alpha f'(x_0)$ con $\\alpha > 0$ pequeño, entonces $f(x_0 + h) < f(x_0)$ siempre que $f'(x_0) \\neq 0$."
      },
      {
        label: "Reglas algebraicas de derivación",
        body: "Las cuatro reglas fundamentales permiten derivar cualquier función elemental de forma mecánica:\n\n**Potencia**: $(x^n)' = nx^{n-1}$ para todo $n \\in \\mathbb{R}$\n\n**Exponencial y logaritmo**: $(e^x)' = e^x$, $(\\ln x)' = 1/x$\n\n**Trigonométricas**: $(\\sin x)' = \\cos x$, $(\\cos x)' = -\\sin x$, $(\\tan x)' = \\sec^2 x$\n\nAplicando la regla del **producto** a un caso concreto:\n\n$$(x^2 \\sin x)' = 2x \\sin x + x^2 \\cos x$$\n\nAplicando la regla del **cociente**:\n\n$$\\left(\\frac{e^x}{1+x^2}\\right)' = \\frac{e^x(1+x^2) - e^x \\cdot 2x}{(1+x^2)^2} = \\frac{e^x(1-x)^2 + e^x(x^2-1+1)}{(1+x^2)^2}$$\n\nUna identidad útil: $\\frac{d}{dx}\\ln f(x) = \\frac{f'(x)}{f(x)}$, usada en **log-verosimilitud** para simplificar derivadas de productos."
      },
      {
        label: "Regla de la cadena y grafos computacionales",
        body: "Para $z = f(y)$, $y = g(x)$, la regla de la cadena establece:\n\n$$\\frac{dz}{dx} = \\frac{dz}{dy} \\cdot \\frac{dy}{dx}$$\n\nPara cadenas más largas $z = f_n \\circ f_{n-1} \\circ \\cdots \\circ f_1(x)$:\n\n$$\\frac{dz}{dx} = \\prod_{k=1}^{n} f_k'(a_k), \\quad a_k = f_{k-1} \\circ \\cdots \\circ f_1(x)$$\n\nEn un **grafo computacional** con múltiples caminos (DAG), la regla de la cadena se generaliza sumando sobre todos los caminos de $z$ a $x$:\n\n$$\\frac{\\partial z}{\\partial x} = \\sum_{\\text{caminos } x \\to z} \\prod_{\\text{aristas del camino}} \\frac{\\partial (\\text{nodo hijo})}{\\partial (\\text{nodo padre})}$$\n\nEsto es exactamente lo que implementa **backpropagation**: un recorrido en orden topológico inverso del grafo acumulando productos de derivadas locales."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "La derivada y la regla de la cadena son el corazón matemático del entrenamiento de redes neuronales:\n\n**Backpropagation** calcula $\\partial \\mathcal{L}/\\partial w_{ij}$ para cada peso $w_{ij}$ aplicando la regla de la cadena hacia atrás en el grafo computacional. Para una red de $L$ capas con activaciones $\\sigma$:\n\n$$\\frac{\\partial \\mathcal{L}}{\\partial W^{(l)}} = \\delta^{(l)} (a^{(l-1)})^\\top, \\quad \\delta^{(l)} = \\left(\\frac{\\partial \\mathcal{L}}{\\partial a^{(l)}}\\right) \\odot \\sigma'(z^{(l)})$$\n\n**Gradiente de funciones de activación**: la elección de $\\sigma$ afecta directamente la magnitud de las derivadas. ReLU tiene $\\sigma'(x) = \\mathbf{1}_{x>0}$, evitando el **vanishing gradient** que sufre $\\sigma'_{\\text{sigmoid}} = \\sigma(1-\\sigma) \\leq 0.25$.\n\n**Diferenciación automática** (autograd): PyTorch y JAX implementan la regla de la cadena en modo reverso (reverse-mode AD) sobre grafos dinámicos, calculando todos los gradientes en un solo backward pass con costo $O(\\text{forward})$.\n\n**Derivadas de orden superior**: la Hessiana $H_{ij} = \\partial^2 \\mathcal{L}/\\partial w_i \\partial w_j$ aparece en métodos de segundo orden (Newton, L-BFGS) y en análisis de curvatura de la pérdida."
      },
    ],
    code: `# Python - Derivadas: definición, reglas y autograd
import numpy as np
import torch

# ── 1. Derivada numérica por diferencias finitas ──────────────────────────
def deriv_numerica(f, x, h=1e-5):
    """Diferencia central: O(h²) vs O(h) de diferencia hacia adelante."""
    return (f(x + h) - f(x - h)) / (2 * h)

f  = lambda x: np.sin(x) * np.exp(-0.1 * x**2)
df = lambda x: np.cos(x) * np.exp(-0.1 * x**2) - 0.2 * x * np.sin(x) * np.exp(-0.1 * x**2)

x0 = 1.2
print(f"Derivada numérica:  {deriv_numerica(f, x0):.8f}")
print(f"Derivada analítica: {df(x0):.8f}")
print(f"Error relativo:     {abs(deriv_numerica(f, x0) - df(x0)) / abs(df(x0)):.2e}")

# ── 2. Regla de la cadena — composición manual ────────────────────────────
# z = log(sin²(x) + 1)  →  dz/dx via cadena
def cadena(x):
    y1 = np.sin(x)           # dy1/dx = cos(x)
    y2 = y1**2 + 1           # dy2/dy1 = 2*sin(x)
    z  = np.log(y2)          # dz/dy2 = 1/(sin²(x)+1)
    # Regla de cadena: dz/dx = (1/y2) * 2*sin(x) * cos(x)
    dz_dx = (1 / y2) * 2 * y1 * np.cos(x)
    return z, dz_dx

z, dz = cadena(x0)
z_num = deriv_numerica(lambda x: np.log(np.sin(x)**2 + 1), x0)
print(f"\\nCadena analítica: {dz:.8f}")
print(f"Cadena numérica:  {z_num:.8f}")

# ── 3. Autograd con PyTorch ───────────────────────────────────────────────
x = torch.tensor(x0, requires_grad=True, dtype=torch.float64)

# Grafo computacional dinámico
y1 = torch.sin(x)
y2 = y1**2 + 1
z  = torch.log(y2)

z.backward()   # backprop: aplica regla de cadena automáticamente
print(f"\\nAutograd PyTorch: {x.grad.item():.8f}")

# ── 4. Derivadas de funciones de activación ───────────────────────────────
x_arr = np.linspace(-4, 4, 200)

# Sigmoid y su derivada
sigmoid  = lambda x: 1 / (1 + np.exp(-x))
dsigmoid = lambda x: sigmoid(x) * (1 - sigmoid(x))   # máx = 0.25 en x=0

# ReLU y su derivada (subgradiente en 0)
relu  = lambda x: np.maximum(0, x)
drelu = lambda x: (x > 0).astype(float)               # ∈ {0, 1}

# Tanh y su derivada
dtanh = lambda x: 1 - np.tanh(x)**2                   # máx = 1 en x=0

print("\\nDerivadas de activaciones en x=0:")
print(f"  σ'(0)    = {dsigmoid(0):.4f}  (máx posible)")
print(f"  ReLU'(0) = subgradiente ∈ [0,1]")
print(f"  tanh'(0) = {dtanh(0):.4f}")

# ── 5. Derivada de log-verosimilitud (regresión logística) ───────────────
# L(w) = -[y log σ(wᵀx) + (1-y) log(1-σ(wᵀx))]
# dL/dw = (σ(wᵀx) - y) * x   — derivada limpia por regla de cadena + log
n_samples = 100
X_data = np.random.randn(n_samples, 3)
y_true = (np.random.randn(n_samples) > 0).astype(float)
w = np.zeros(3)

for _ in range(200):
    logits = X_data @ w
    preds  = sigmoid(logits)
    grad   = X_data.T @ (preds - y_true) / n_samples   # regla cadena
    w     -= 0.5 * grad

print(f"\\nPesos logreg tras 200 pasos GD: {np.round(w, 4)}")

# ── 6. Derivada de orden superior (Hessiana diagonal) ────────────────────
x = torch.tensor(x0, requires_grad=True, dtype=torch.float64)
z = torch.sin(x)**2 + torch.cos(x)
grad1 = torch.autograd.grad(z, x, create_graph=True)[0]
grad2 = torch.autograd.grad(grad1, x)[0]
print(f"\\nf''({x0:.1f}) via autograd: {grad2.item():.6f}")
`,
    related: ["Gradiente y Derivada Parcial", "Backpropagation", "Descenso de Gradiente", "Regla de la Cadena Multivariable", "Diferenciación Automática", "Serie de Taylor"],
    hasViz: true,
    vizType: "derivRule",
  },
  {
    id: 37,
    section: "Cálculo y Optimización: El Motor de Aprendizaje",
    sectionCode: "III",
    name: "Regla de la Cadena Multivariable",
    tags: ["regla de la cadena", "derivada parcial", "gradiente", "jacobiano", "backpropagation", "cálculo multivariable"],
    definition: "La regla de la cadena multivariable generaliza la regla escalar al caso en que funciones vectoriales se componen entre sí. Si z = f(y₁,…,yₘ) y cada yᵢ = gᵢ(x₁,…,xₙ), entonces la derivada parcial de z respecto a cada xⱼ es la suma de las contribuciones de todos los caminos intermedios que conectan xⱼ con z a través de las yᵢ. En su forma matricial, la regla establece que el Jacobiano de la composición es el producto de los Jacobianos de las funciones componentes. Esta estructura es el fundamento matemático exacto del algoritmo backpropagation en redes neuronales profundas.",
    formal: {
      notation: "Sean $\\mathbf{g}: \\mathbb{R}^n \\to \\mathbb{R}^m$ y $f: \\mathbb{R}^m \\to \\mathbb{R}^p$ diferenciables, con $\\mathbf{y} = \\mathbf{g}(\\mathbf{x})$ y $\\mathbf{z} = f(\\mathbf{y})$",
      body: "\\frac{\\partial z_k}{\\partial x_j} = \\sum_{i=1}^{m} \\frac{\\partial z_k}{\\partial y_i} \\cdot \\frac{\\partial y_i}{\\partial x_j}, \\qquad J_{f \\circ \\mathbf{g}}(\\mathbf{x}) = J_f(\\mathbf{g}(\\mathbf{x})) \\cdot J_{\\mathbf{g}}(\\mathbf{x})",
      geometric: "\\nabla_{\\mathbf{x}} z = J_{\\mathbf{g}}(\\mathbf{x})^\\top \\nabla_{\\mathbf{y}} z \\quad \\in \\mathbb{R}^n, \\qquad (\\text{caso } p=1: \\text{ transpuesta del Jacobiano})",
      properties: [
        "\\text{Jacobiano compuesto: } J_{f \\circ g}(\\mathbf{x}) = J_f(g(\\mathbf{x})) \\cdot J_g(\\mathbf{x}) \\in \\mathbb{R}^{p \\times n}",
        "\\text{Suma sobre caminos: } \\frac{\\partial z}{\\partial x_j} = \\sum_{i} \\frac{\\partial z}{\\partial y_i}\\frac{\\partial y_i}{\\partial x_j} \\text{ (un término por nodo intermedio)}",
        "\\text{Modo reverso (backprop): } \\bar{\\mathbf{x}} = J_g^\\top \\bar{\\mathbf{y}}, \\quad \\bar{\\mathbf{y}} = \\nabla_{\\mathbf{y}} \\mathcal{L} \\text{ (vector adjunto)}",
        "\\text{Modo directo (forward AD): } \\dot{\\mathbf{y}} = J_g \\dot{\\mathbf{x}}, \\quad \\dot{\\mathbf{x}} = \\mathbf{e}_j \\text{ calcula columna } j \\text{ del Jacobiano}",
        "\\text{Costo: reverso } O(p \\cdot \\text{FLOPs}),\\text{ directo } O(n \\cdot \\text{FLOPs}); \\text{ reverso óptimo si } p \\ll n",
      ],
    },
    intuition: "Imagina una fábrica con etapas en cadena: las materias primas $\\mathbf{x}$ entran, se procesan en intermedios $\\mathbf{y}$, y producen el producto final $z$. Si quieres saber 'cuánto cambia $z$ si ajusto la materia prima $x_j$', debes rastrear todos los caminos por los que $x_j$ influye sobre cada $y_i$, y luego cómo cada $y_i$ afecta $z$. La regla de la cadena suma todas esas contribuciones. Backpropagation hace exactamente esto en reversa: primero calcula cuánto afecta cada $y_i$ al error $\\mathcal{L}$, y luego retropropaga esa sensibilidad hacia $\\mathbf{x}$, multiplicando por los Jacobianos locales de cada etapa.",
    development: [
      {
        label: "Caso escalar a vectorial: derivadas parciales",
        body: "Sea $z = f(y_1, y_2)$ con $y_1 = g_1(x_1, x_2)$ y $y_2 = g_2(x_1, x_2)$. La regla de la cadena para $\\partial z / \\partial x_1$ suma las contribuciones de los dos caminos $x_1 \\to y_1 \\to z$ y $x_1 \\to y_2 \\to z$:\n\n$$\\frac{\\partial z}{\\partial x_1} = \\frac{\\partial z}{\\partial y_1}\\frac{\\partial y_1}{\\partial x_1} + \\frac{\\partial z}{\\partial y_2}\\frac{\\partial y_2}{\\partial x_1}$$\n\nGráficamente, esto corresponde a sumar los productos de las etiquetas a lo largo de todos los caminos dirigidos de $x_1$ a $z$ en el grafo computacional. En general, para $m$ intermedios y $n$ entradas:\n\n$$\\frac{\\partial z}{\\partial x_j} = \\sum_{i=1}^{m} \\frac{\\partial z}{\\partial y_i} \\frac{\\partial y_i}{\\partial x_j}, \\quad j = 1, \\ldots, n$$\n\nEsta suma es un producto interno: $\\nabla_{\\mathbf{y}} z \\cdot \\frac{\\partial \\mathbf{y}}{\\partial x_j}$, donde $\\frac{\\partial \\mathbf{y}}{\\partial x_j}$ es la $j$-ésima columna del Jacobiano $J_g$."
      },
      {
        label: "Forma Jacobiana y composición matricial",
        body: "Cuando tanto $f$ como $g$ son vectoriales ($f: \\mathbb{R}^m \\to \\mathbb{R}^p$, $g: \\mathbb{R}^n \\to \\mathbb{R}^m$), la regla de la cadena toma su forma matricial más general:\n\n$$J_{f \\circ g}(\\mathbf{x}) = J_f(g(\\mathbf{x})) \\cdot J_g(\\mathbf{x}) \\in \\mathbb{R}^{p \\times n}$$\n\ndonde el Jacobiano $J_h(\\mathbf{a}) \\in \\mathbb{R}^{q \\times r}$ tiene entradas $(J_h)_{ki} = \\partial h_k / \\partial a_i$.\n\nPara una red de $L$ capas $\\mathbf{a}^{(l)} = f_l(\\mathbf{a}^{(l-1)})$, el Jacobiano total de la pérdida respecto a los pesos de la capa $l$ es:\n\n$$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{a}^{(l-1)}} = J_{f_l}^\\top \\cdot \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{a}^{(l)}}$$\n\nEsto es exactamente el paso de backpropagation entre capas: multiplicar el gradiente entrante por el Jacobiano transpuesto de la capa actual."
      },
      {
        label: "Modo reverso vs. modo directo (Diferenciación Automática)",
        body: "La regla de la cadena puede evaluarse en dos órdenes distintos, con costos muy diferentes:\n\n**Modo directo** (forward-mode AD): fija una dirección $\\dot{\\mathbf{x}} = \\mathbf{e}_j$ y propaga hacia adelante:\n\n$$\\dot{\\mathbf{y}} = J_g \\dot{\\mathbf{x}}, \\quad \\dot{z} = \\nabla_\\mathbf{y} f \\cdot \\dot{\\mathbf{y}}$$\n\nCalcula una columna del Jacobiano por pasada. Costo: $O(n)$ pasadas para el Jacobiano completo. Eficiente cuando $n \\ll p$.\n\n**Modo reverso** (reverse-mode AD, backprop): parte del gradiente de la salida $\\bar{z} = 1$ y propaga hacia atrás:\n\n$$\\bar{\\mathbf{y}} = J_f^\\top \\bar{\\mathbf{z}}, \\quad \\bar{\\mathbf{x}} = J_g^\\top \\bar{\\mathbf{y}}$$\n\nCalcula una fila del Jacobiano (o el gradiente completo si $p=1$) por pasada. Costo: $O(1)$ pasada para $\\nabla_\\mathbf{x} \\mathcal{L}$. **Óptimo para ML** donde $p=1$ (pérdida escalar) y $n$ = millones de parámetros.\n\nLa razón por la que backprop escala: con un solo backward pass se obtienen todos los $n$ gradientes, mientras que forward-mode requeriría $n$ pasadas."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "La regla de la cadena multivariable es el algoritmo backpropagation, sin más. Para una red neuronal con pérdida $\\mathcal{L}$, capas $l = 1, \\ldots, L$ y pre-activaciones $\\mathbf{z}^{(l)} = W^{(l)} \\mathbf{a}^{(l-1)} + \\mathbf{b}^{(l)}$, $\\mathbf{a}^{(l)} = \\sigma(\\mathbf{z}^{(l)})$:\n\n$$\\boldsymbol{\\delta}^{(l)} \\triangleq \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{z}^{(l)}} = \\left(W^{(l+1)\\top} \\boldsymbol{\\delta}^{(l+1)}\\right) \\odot \\sigma'(\\mathbf{z}^{(l)})$$\n\n$$\\frac{\\partial \\mathcal{L}}{\\partial W^{(l)}} = \\boldsymbol{\\delta}^{(l)} (\\mathbf{a}^{(l-1)})^\\top, \\quad \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{b}^{(l)}} = \\boldsymbol{\\delta}^{(l)}$$\n\nCada $\\boldsymbol{\\delta}^{(l)}$ es el vector adjunto de la capa $l$: cuantifica la sensibilidad de $\\mathcal{L}$ a perturbaciones en $\\mathbf{z}^{(l)}$.\n\n**Gradient checkpointing**: en redes muy profundas, almacenar todos los $\\mathbf{a}^{(l)}$ para el backward pass consume $O(L)$ memoria. Checkpointing recalcula activaciones selectivamente durante el backward, reduciendo memoria a $O(\\sqrt{L})$ a costa de $\\approx 33\\%$ más FLOPs.\n\n**Jacobian-vector products (JVP) y VJPs**: PyTorch expone `torch.autograd.functional.jvp` y `vjp` directamente, permitiendo implementar optimizadores de segundo orden, meta-learning (MAML) y cálculo de la Hessiana vía doble backprop."
      },
    ],
    code: `# Python - Regla de la cadena multivariable: Jacobianos y backprop manual
import numpy as np
import torch
import torch.nn.functional as F

# ── 1. Jacobiano numérico de una función vectorial ────────────────────────
def jacobiano_numerico(f, x, h=1e-5):
    """Jacobiano J ∈ R^{m×n} por diferencias centrales."""
    fx = f(x)
    m, n = len(fx), len(x)
    J = np.zeros((m, n))
    for j in range(n):
        xp, xm = x.copy(), x.copy()
        xp[j] += h; xm[j] -= h
        J[:, j] = (f(xp) - f(xm)) / (2 * h)
    return J

# g: R² → R³
g = lambda x: np.array([
    np.sin(x[0]) * x[1],
    x[0]**2 - x[1]**2,
    np.exp(x[0] + x[1]),
])

x0 = np.array([0.5, 1.2])
J_num = jacobiano_numerico(g, x0)

# Jacobiano analítico de g
J_ana = np.array([
    [np.cos(x0[0]) * x0[1],  np.sin(x0[0])        ],
    [2 * x0[0],              -2 * x0[1]             ],
    [np.exp(x0[0]+x0[1]),     np.exp(x0[0]+x0[1])  ],
])
print("Error Jacobiano:", np.max(np.abs(J_num - J_ana)))

# ── 2. Regla de la cadena como producto de Jacobianos ────────────────────
# z = f(g(x)),  f: R³ → R²,  g: R² → R³
f_fn = lambda y: np.array([y[0] + y[1]**2, np.sin(y[2])])
y0   = g(x0)

J_g  = J_ana                              # (3×2)
J_f  = np.array([                         # (2×3) — Jacobiano de f en y0
    [1.0, 2*y0[1], 0.0             ],
    [0.0, 0.0,     np.cos(y0[2])   ],
])
J_fg = J_f @ J_g                          # (2×2) — cadena
print("\\nJacobiano compuesto J_f∘g:", np.round(J_fg, 5))

# Verificar con Jacobiano numérico de la composición
fog  = lambda x: f_fn(g(x))
print("Verificación numérica:    ", np.round(jacobiano_numerico(fog, x0), 5))

# ── 3. Backprop manual en red de 2 capas ─────────────────────────────────
np.random.seed(42)
n_in, n_hid, n_out = 4, 6, 2
n_samples = 8

W1 = np.random.randn(n_hid, n_in)  * 0.1
b1 = np.zeros(n_hid)
W2 = np.random.randn(n_out, n_hid) * 0.1
b2 = np.zeros(n_out)

X  = np.random.randn(n_samples, n_in)
Y  = np.eye(n_out)[np.random.randint(0, n_out, n_samples)]  # one-hot

sigmoid = lambda z: 1 / (1 + np.exp(-z))

# Forward pass
z1 = X @ W1.T + b1           # (n, n_hid)
a1 = sigmoid(z1)             # activación capa 1
z2 = a1 @ W2.T + b2          # (n, n_out)
# Softmax + cross-entropy
exp_z = np.exp(z2 - z2.max(axis=1, keepdims=True))
probs = exp_z / exp_z.sum(axis=1, keepdims=True)
loss  = -np.mean(np.sum(Y * np.log(probs + 1e-9), axis=1))

# Backward pass — regla de la cadena capa por capa
delta2 = (probs - Y) / n_samples         # ∂L/∂z2  (n, n_out)
dW2    = delta2.T @ a1                   # (n_out, n_hid)
db2    = delta2.sum(axis=0)

delta1 = (delta2 @ W2) * a1 * (1 - a1)  # ∂L/∂z1: VJP × σ'(z1)
dW1    = delta1.T @ X                    # (n_hid, n_in)
db1    = delta1.sum(axis=0)

print(f"\\nLoss: {loss:.4f}")
print(f"||dW1||: {np.linalg.norm(dW1):.4f}  ||dW2||: {np.linalg.norm(dW2):.4f}")

# ── 4. Verificar gradientes con PyTorch autograd ──────────────────────────
Xt  = torch.tensor(X,  dtype=torch.float64)
Yt  = torch.tensor(Y,  dtype=torch.float64)
W1t = torch.tensor(W1, dtype=torch.float64, requires_grad=True)
W2t = torch.tensor(W2, dtype=torch.float64, requires_grad=True)

a1t   = torch.sigmoid(Xt @ W1t.T)
z2t   = a1t @ W2t.T
losst = F.cross_entropy(z2t.float(), Yt.argmax(1))
losst.backward()

print("\\nError dW1 (manual vs autograd):",
      np.max(np.abs(dW1 - W1t.grad.numpy())))
print("Error dW2 (manual vs autograd):",
      np.max(np.abs(dW2 - W2t.grad.numpy())))

# ── 5. VJP y JVP explícitos con torch.autograd.functional ────────────────
from torch.autograd.functional import vjp, jvp

fn  = lambda w: (torch.sigmoid(Xt @ w.T) @ W2t.detach().T).sum()
v   = torch.ones(1, dtype=torch.float64)

# VJP: v^T · J  (modo reverso — backprop)
_, vjp_result = vjp(fn, torch.tensor(W1, requires_grad=True), v)
print("\\nVJP shape:", vjp_result.shape)   # (n_hid, n_in)
`,
    related: ["Derivada y Reglas de Derivación", "Gradiente y Derivada Parcial", "Jacobiano y Hessiano", "Backpropagation", "Diferenciación Automática", "Descenso de Gradiente"],
    hasViz: true,
    vizType: "chainMultivar",
  },
  {
    id: 38,
    section: "Cálculo y Optimización: El Motor de Aprendizaje",
    sectionCode: "III",
    name: "Derivadas Parciales y Gradiente",
    tags: ["derivada parcial", "gradiente", "superficie", "dirección de máximo ascenso", "cálculo multivariable", "optimización"],
    definition: "La derivada parcial de una función f(x₁,…,xₙ) respecto a xⱼ mide la tasa de cambio de f cuando solo varía xⱼ, manteniendo todas las demás variables fijas. Es la derivada ordinaria de la función de una variable que resulta de congelar las demás coordenadas. El gradiente ∇f agrupa todas las derivadas parciales en un vector que apunta en la dirección de máximo crecimiento de f en cada punto, con magnitud igual a la tasa de cambio máxima. En ML, el gradiente de la función de pérdida respecto a los parámetros es el objeto central del entrenamiento: indica cómo ajustar cada peso para reducir el error.",
    formal: {
      notation: "Sea $f: \\mathbb{R}^n \\to \\mathbb{R}$ diferenciable en $\\mathbf{x}_0 \\in \\mathbb{R}^n$",
      body: "\\frac{\\partial f}{\\partial x_j}(\\mathbf{x}_0) = \\lim_{h \\to 0} \\frac{f(\\mathbf{x}_0 + h\\,\\mathbf{e}_j) - f(\\mathbf{x}_0)}{h}, \\qquad \\nabla f(\\mathbf{x}_0) = \\left(\\frac{\\partial f}{\\partial x_1}, \\ldots, \\frac{\\partial f}{\\partial x_n}\\right)^\\top \\in \\mathbb{R}^n",
      geometric: "f(\\mathbf{x}_0 + \\mathbf{d}) \\approx f(\\mathbf{x}_0) + \\nabla f(\\mathbf{x}_0)^\\top \\mathbf{d} + O(\\|\\mathbf{d}\\|^2), \\quad \\frac{\\partial f}{\\partial \\mathbf{d}}\\bigg|_{\\mathbf{x}_0} = \\nabla f(\\mathbf{x}_0)^\\top \\hat{\\mathbf{d}} \\leq \\|\\nabla f(\\mathbf{x}_0)\\|",
      properties: [
        "\\text{Gradiente ortogonal a curvas de nivel: } \\nabla f(\\mathbf{x}_0) \\perp \\{\\mathbf{x} : f(\\mathbf{x}) = f(\\mathbf{x}_0)\\}",
        "\\text{Dirección de máximo ascenso: } \\underset{\\|\\mathbf{d}\\|=1}{\\arg\\max}\\; \\nabla f^\\top \\mathbf{d} = \\hat{\\nabla f}, \\quad \\text{tasa máxima} = \\|\\nabla f\\|",
        "\\text{Derivada direccional: } D_{\\mathbf{u}} f(\\mathbf{x}_0) = \\nabla f(\\mathbf{x}_0)^\\top \\mathbf{u}, \\quad \\|\\mathbf{u}\\| = 1",
        "\\text{Linealidad: } \\nabla(\\alpha f + \\beta g) = \\alpha \\nabla f + \\beta \\nabla g",
        "\\text{Condición necesaria de extremo interior: } \\nabla f(\\mathbf{x}^*) = \\mathbf{0} \\;(\\text{punto crítico})",
      ],
    },
    intuition: "Imagina una superficie montañosa $z = f(x,y)$. La derivada parcial $\\partial f/\\partial x$ te dice cuánto sube la pendiente si caminas exactamente hacia el este (eje $x$), y $\\partial f/\\partial y$ si caminas hacia el norte. El gradiente $\\nabla f = (\\partial f/\\partial x,\\, \\partial f/\\partial y)$ combina ambas: apunta en la dirección de la subida más empinada, como la dirección en que rodaría una gota de agua al revés. Las curvas de nivel son las líneas de igual altitud —el gradiente siempre las cruza en ángulo recto.",
    development: [
      {
        label: "Definición formal y cálculo",
        body: "La derivada parcial $\\partial f / \\partial x_j$ se calcula aplicando las reglas de derivación ordinaria tratando $x_j$ como la única variable y el resto como constantes. Para $f(x, y) = x^2 y + e^{xy}$:\n\n$$\\frac{\\partial f}{\\partial x} = 2xy + y e^{xy}, \\qquad \\frac{\\partial f}{\\partial y} = x^2 + x e^{xy}$$\n\nLas derivadas parciales de orden superior se definen iterando el proceso. La matriz de segundas derivadas es la **Hessiana**:\n\n$$H_{ij} = \\frac{\\partial^2 f}{\\partial x_i \\partial x_j}$$\n\nEl **teorema de Schwarz** garantiza $\\partial^2 f / \\partial x_i \\partial x_j = \\partial^2 f / \\partial x_j \\partial x_i$ cuando las segundas derivadas son continuas, por lo que $H$ es simétrica. La Hessiana determina la curvatura local y clasifica los puntos críticos."
      },
      {
        label: "Gradiente: geometría y derivada direccional",
        body: "El gradiente $\\nabla f(\\mathbf{x}_0)$ caracteriza completamente la variación lineal de $f$ en $\\mathbf{x}_0$. La **derivada direccional** en la dirección unitaria $\\mathbf{u}$ es:\n\n$$D_{\\mathbf{u}} f(\\mathbf{x}_0) = \\lim_{h \\to 0} \\frac{f(\\mathbf{x}_0 + h\\mathbf{u}) - f(\\mathbf{x}_0)}{h} = \\nabla f(\\mathbf{x}_0)^\\top \\mathbf{u} = \\|\\nabla f\\| \\cos\\theta$$\n\ndonde $\\theta$ es el ángulo entre $\\nabla f$ y $\\mathbf{u}$. El máximo se alcanza cuando $\\theta = 0$, es decir $\\mathbf{u} = \\nabla f / \\|\\nabla f\\|$, confirmando que el gradiente apunta hacia el máximo crecimiento.\n\nGeométricamente, $\\nabla f(\\mathbf{x}_0)$ es ortogonal a la hipersuperficie de nivel $\\{\\mathbf{x} : f(\\mathbf{x}) = c\\}$ que pasa por $\\mathbf{x}_0$. Esto se verifica diferenciando $f(\\mathbf{x}(t)) = c$ respecto a $t$: $\\nabla f \\cdot \\dot{\\mathbf{x}} = 0$ para toda curva $\\mathbf{x}(t)$ en la superficie de nivel."
      },
      {
        label: "Regla del producto, cociente y composición en varias variables",
        body: "Las reglas algebraicas de diferenciación se extienden componente a componente al caso multivariable:\n\n$$\\nabla(fg) = g\\,\\nabla f + f\\,\\nabla g$$\n\n$$\\nabla\\left(\\frac{f}{g}\\right) = \\frac{g\\,\\nabla f - f\\,\\nabla g}{g^2}$$\n\nPara composición $h(\\mathbf{x}) = \\phi(f(\\mathbf{x}))$ con $\\phi: \\mathbb{R} \\to \\mathbb{R}$:\n\n$$\\nabla h(\\mathbf{x}) = \\phi'(f(\\mathbf{x}))\\, \\nabla f(\\mathbf{x})$$\n\nEjemplo relevante en ML: la pérdida logística $\\mathcal{L}(\\mathbf{w}) = -\\log \\sigma(y\\,\\mathbf{w}^\\top\\mathbf{x})$, con $\\sigma' = \\sigma(1-\\sigma)$:\n\n$$\\nabla_{\\mathbf{w}} \\mathcal{L} = -(1 - \\sigma(y\\,\\mathbf{w}^\\top\\mathbf{x}))\\,y\\,\\mathbf{x} = (\\hat{p} - 1)\\,y\\,\\mathbf{x}$$\n\ndonde $\\hat{p} = \\sigma(y\\,\\mathbf{w}^\\top\\mathbf{x})$ es la probabilidad predicha. La forma limpia del gradiente de la log-verosimilitud resulta de la identidad $\\frac{d}{dz}\\log\\sigma(z) = 1-\\sigma(z)$."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "El gradiente es el objeto central de todo el aprendizaje supervisado por optimización:\n\n**Función de pérdida MSE**: $\\mathcal{L}(\\mathbf{w}) = \\frac{1}{n}\\|\\mathbf{X}\\mathbf{w} - \\mathbf{y}\\|^2$, gradiente exacto:\n\n$$\\nabla_{\\mathbf{w}} \\mathcal{L} = \\frac{2}{n} \\mathbf{X}^\\top(\\mathbf{X}\\mathbf{w} - \\mathbf{y})$$\n\nIgualando a cero da la **ecuación normal**: $\\mathbf{w}^* = (\\mathbf{X}^\\top\\mathbf{X})^{-1}\\mathbf{X}^\\top\\mathbf{y}$.\n\n**Gradient clipping**: en RNNs, $\\|\\nabla \\mathcal{L}\\|$ puede crecer exponencialmente (exploding gradients). Clipping reescala el gradiente si $\\|g\\| > \\tau$: $g \\leftarrow g \\cdot \\tau / \\|g\\|$, manteniendo la dirección pero limitando la magnitud.\n\n**Gradientes por lotes**: el gradiente estocástico (SGD) estima $\\nabla \\mathcal{L}$ con un mini-batch $\\mathcal{B}$:\n\n$$\\hat{\\nabla} \\mathcal{L} = \\frac{1}{|\\mathcal{B}|} \\sum_{i \\in \\mathcal{B}} \\nabla_{\\mathbf{w}} \\ell_i(\\mathbf{w})$$\n\nes un estimador insesgado del gradiente completo, con varianza $O(1/|\\mathcal{B}|)$.\n\n**Superficies de pérdida en DL**: para redes profundas, $\\nabla_{\\mathbf{w}} \\mathcal{L} = \\mathbf{0}$ tiene exponencialmente muchas soluciones (puntos de silla y mínimos locales planos). La geometría del gradiente y la Hessiana en estos puntos es un área activa de investigación (loss landscape, sharpness-aware minimization)."
      },
    ],
    code: `# Python - Derivadas parciales, gradiente y geometría
import numpy as np
import torch

# ── 1. Derivadas parciales numéricas ─────────────────────────────────────
def grad_numerico(f, x, h=1e-5):
    """Gradiente por diferencias centrales: ∇f(x) ∈ R^n."""
    n = len(x)
    g = np.zeros(n)
    for j in range(n):
        xp, xm = x.copy(), x.copy()
        xp[j] += h; xm[j] -= h
        g[j] = (f(xp) - f(xm)) / (2 * h)
    return g

# f(x,y) = sin(x)*cos(y) + x²y
f   = lambda v: np.sin(v[0])*np.cos(v[1]) + v[0]**2 * v[1]
dfdx = lambda v: np.cos(v[0])*np.cos(v[1]) + 2*v[0]*v[1]   # ∂f/∂x
dfdy = lambda v: -np.sin(v[0])*np.sin(v[1]) + v[0]**2       # ∂f/∂y

x0 = np.array([1.0, 0.5])
g_num = grad_numerico(f, x0)
g_ana = np.array([dfdx(x0), dfdy(x0)])

print("Gradiente numérico: ", np.round(g_num, 6))
print("Gradiente analítico:", np.round(g_ana, 6))
print("Error máximo:       ", np.max(np.abs(g_num - g_ana)))

# ── 2. Derivada direccional ───────────────────────────────────────────────
def deriv_direccional(f, x, u):
    """D_u f(x) = ∇f(x)·u, con u unitario."""
    u = u / np.linalg.norm(u)           # normalizar
    return grad_numerico(f, x) @ u

# Dirección de máximo ascenso = ∇f/‖∇f‖
grad   = g_ana
u_max  = grad / np.linalg.norm(grad)
u_perp = np.array([-grad[1], grad[0]]) / np.linalg.norm(grad)  # perpendicular

print(f"\\nD_{{∇f}} f(x₀) = {deriv_direccional(f, x0, u_max):.6f}  (debe ser ‖∇f‖={np.linalg.norm(grad):.6f})")
print(f"D_{{⊥}}  f(x₀)  = {deriv_direccional(f, x0, u_perp):.6f}  (debe ser ≈ 0, curva de nivel)")

# ── 3. Hessiana numérica ─────────────────────────────────────────────────
def hessiana_numerica(f, x, h=1e-4):
    """Hessiana H ∈ R^{n×n} por diferencias finitas de segundo orden."""
    n = len(x)
    H = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            xpp = x.copy(); xpp[i] += h; xpp[j] += h
            xpm = x.copy(); xpm[i] += h; xpm[j] -= h
            xmp = x.copy(); xmp[i] -= h; xmp[j] += h
            xmm = x.copy(); xmm[i] -= h; xmm[j] -= h
            H[i,j] = (f(xpp) - f(xpm) - f(xmp) + f(xmm)) / (4*h*h)
    return H

H = hessiana_numerica(f, x0)
print("\\nHessiana en x₀:")
print(np.round(H, 4))
print("Simétrica:", np.allclose(H, H.T))
eigvals = np.linalg.eigvalsh(H)
print("Eigenvalores:", np.round(eigvals, 4),
      "→", "mínimo local" if all(eigvals>0) else "silla" if any(eigvals<0) and any(eigvals>0) else "máximo")

# ── 4. Gradiente con autograd (PyTorch) ──────────────────────────────────
x_t = torch.tensor(x0, requires_grad=True, dtype=torch.float64)
f_t = torch.sin(x_t[0])*torch.cos(x_t[1]) + x_t[0]**2 * x_t[1]
f_t.backward()
print("\\nGradiente autograd:", x_t.grad.numpy())

# ── 5. Gradiente de MSE — regresión lineal ────────────────────────────────
np.random.seed(0)
n, p = 100, 5
X_d  = np.random.randn(n, p)
w_true = np.array([1.5, -2.0, 0.8, 0.0, 3.1])
y_d  = X_d @ w_true + 0.3*np.random.randn(n)

def mse_loss(w): return np.mean((X_d @ w - y_d)**2)
def mse_grad(w): return 2/n * X_d.T @ (X_d @ w - y_d)

w = np.zeros(p)
lr = 0.05
for step in range(300):
    g = mse_grad(w)
    w = w - lr * g

print(f"\\nw estimado:  {np.round(w, 4)}")
print(f"w verdadero: {w_true}")
print(f"‖∇L(w*)‖ = {np.linalg.norm(mse_grad(w)):.6f}  (≈0 en mínimo)")

# ── 6. Gradient clipping ──────────────────────────────────────────────────
def clip_grad(g, tau=1.0):
    norm = np.linalg.norm(g)
    return g * tau / norm if norm > tau else g

g_large = np.array([10.5, -8.3, 15.2])
g_clipped = clip_grad(g_large, tau=1.0)
print(f"\\n‖g‖ antes: {np.linalg.norm(g_large):.2f}, después: {np.linalg.norm(g_clipped):.4f}")
print("Dirección preservada:", np.allclose(g_large/np.linalg.norm(g_large),
                                           g_clipped/np.linalg.norm(g_clipped)))
`,
    related: ["Derivada y Reglas de Derivación", "Regla de la Cadena Multivariable", "Jacobiano y Hessiano", "Descenso de Gradiente", "Backpropagation", "Optimización Convexa"],
    hasViz: true,
    vizType: "partialGrad",
  },
  {
    id: 40,
    section: "Cálculo y Optimización: El Motor de Aprendizaje",
    sectionCode: "III",
    name: "Matriz Jacobiana",
    tags: ["jacobiano", "derivada de función vectorial", "transformación lineal local", "diferenciación automática", "backpropagation", "cálculo multivariable"],
    definition: "La matriz Jacobiana de una función vectorial f: Rⁿ → Rᵐ en un punto x₀ es la matriz de todas las derivadas parciales de primer orden de f evaluadas en x₀, de dimensiones m×n. Cada fila i contiene el gradiente de la componente fᵢ respecto a todas las entradas, y cada columna j contiene las derivadas de todas las salidas respecto a xⱼ. El Jacobiano generaliza simultáneamente la derivada escalar (n=m=1), el gradiente (m=1) y la divergencia (m=n). Linealmente aproxima la función vectorial cerca de x₀, y su determinante —cuando m=n— cuantifica el factor de cambio de volumen local inducido por la transformación.",
    formal: {
      notation: "Sea $\\mathbf{f}: \\mathbb{R}^n \\to \\mathbb{R}^m$ diferenciable en $\\mathbf{x}_0$, con componentes $f_1, \\ldots, f_m$",
      body: "J_{\\mathbf{f}}(\\mathbf{x}_0) = \\frac{\\partial \\mathbf{f}}{\\partial \\mathbf{x}}\\bigg|_{\\mathbf{x}_0} = \\begin{pmatrix} \\dfrac{\\partial f_1}{\\partial x_1} & \\cdots & \\dfrac{\\partial f_1}{\\partial x_n} \\\\ \\vdots & \\ddots & \\vdots \\\\ \\dfrac{\\partial f_m}{\\partial x_1} & \\cdots & \\dfrac{\\partial f_m}{\\partial x_n} \\end{pmatrix} \\in \\mathbb{R}^{m \\times n}",
      geometric: "\\mathbf{f}(\\mathbf{x}_0 + \\mathbf{h}) = \\mathbf{f}(\\mathbf{x}_0) + J_{\\mathbf{f}}(\\mathbf{x}_0)\\,\\mathbf{h} + O(\\|\\mathbf{h}\\|^2), \\qquad \\det J_{\\mathbf{f}} > 0 \\text{ preserva orientación local}",
      properties: [
        "\\text{Regla de la cadena: } J_{\\mathbf{f} \\circ \\mathbf{g}}(\\mathbf{x}) = J_{\\mathbf{f}}(\\mathbf{g}(\\mathbf{x})) \\cdot J_{\\mathbf{g}}(\\mathbf{x}) \\in \\mathbb{R}^{p \\times n}",
        "\\text{VJP (modo reverso): } \\mathbf{v}^\\top J_{\\mathbf{f}} = (J_{\\mathbf{f}}^\\top \\mathbf{v})^\\top,\\quad \\mathbf{v} \\in \\mathbb{R}^m,\\; O(\\text{FLOPs}_f) \\text{ por vector}",
        "\\text{JVP (modo directo): } J_{\\mathbf{f}}\\,\\mathbf{u},\\quad \\mathbf{u} \\in \\mathbb{R}^n,\\; O(\\text{FLOPs}_f) \\text{ por vector}",
        "\\text{Cambio de variable: } \\int_{\\mathbf{f}(\\Omega)} g(\\mathbf{y})\\,d\\mathbf{y} = \\int_{\\Omega} g(\\mathbf{f}(\\mathbf{x}))|\\det J_{\\mathbf{f}}(\\mathbf{x})|\\,d\\mathbf{x}",
        "\\text{Rango: } \\text{rank}(J_{\\mathbf{f}}(\\mathbf{x}_0)) = \\text{rank de la mejor aproximación lineal local de } \\mathbf{f}",
      ],
    },
    intuition: "Imagina que $\\mathbf{f}$ es una función que deforma el espacio: toma un punto $\\mathbf{x}$ y lo mueve a $\\mathbf{f}(\\mathbf{x})$. El Jacobiano $J_{\\mathbf{f}}(\\mathbf{x}_0)$ es el 'microscopio' de esa deformación: si te acercas suficientemente a $\\mathbf{x}_0$, la deformación parece una transformación lineal, y esa transformación lineal es exactamente la multiplicación por $J_{\\mathbf{f}}(\\mathbf{x}_0)$. El determinante dice cuánto se estira o encoge un pequeño cubo de volumen al pasar por $\\mathbf{f}$: si $|\\det J| = 2$ el volumen se duplica; si $|\\det J| = 0$ la transformación aplana el espacio en una dimensión menor.",
    development: [
      {
        label: "Construcción fila a fila y columna a columna",
        body: "Para $\\mathbf{f} = (f_1, \\ldots, f_m)^\\top$ con $\\mathbf{x} = (x_1, \\ldots, x_n)^\\top$, el Jacobiano se construye de dos maneras equivalentes:\n\n**Por filas**: la fila $i$ es el gradiente de $f_i$:\n\n$$J_{i,:} = \\nabla f_i^\\top = \\left(\\frac{\\partial f_i}{\\partial x_1}, \\ldots, \\frac{\\partial f_i}{\\partial x_n}\\right)$$\n\n**Por columnas**: la columna $j$ es la derivada parcial de $\\mathbf{f}$ respecto a $x_j$:\n\n$$J_{:,j} = \\frac{\\partial \\mathbf{f}}{\\partial x_j} = \\left(\\frac{\\partial f_1}{\\partial x_j}, \\ldots, \\frac{\\partial f_m}{\\partial x_j}\\right)^\\top$$\n\nLa columna $j$ responde a la pregunta: 'si perturbo $x_j$ en $\\varepsilon$, ¿cuánto se mueve cada componente de $\\mathbf{f}$?' Esto es exactamente lo que computa el **modo directo** de diferenciación automática con semilla $\\mathbf{u} = \\mathbf{e}_j$: $J_{:,j} = J_{\\mathbf{f}} \\mathbf{e}_j$."
      },
      {
        label: "Jacobiano de transformaciones comunes",
        body: "Algunos Jacobianos de referencia esenciales en ML:\n\n**Transformación afín** $\\mathbf{f}(\\mathbf{x}) = W\\mathbf{x} + \\mathbf{b}$, $W \\in \\mathbb{R}^{m \\times n}$:\n\n$$J_{\\mathbf{f}} = W \\quad \\text{(constante, independiente de } \\mathbf{x}\\text{)}$$\n\n**Softmax** $\\sigma_i(\\mathbf{z}) = e^{z_i}/\\sum_k e^{z_k}$, $\\mathbf{f}: \\mathbb{R}^n \\to \\mathbb{R}^n$:\n\n$$J_{\\sigma}(\\mathbf{z})_{ij} = \\sigma_i(\\delta_{ij} - \\sigma_j) = \\text{diag}(\\boldsymbol{\\sigma}) - \\boldsymbol{\\sigma}\\boldsymbol{\\sigma}^\\top$$\n\n**Activación elemento a elemento** $\\mathbf{f}(\\mathbf{x}) = \\phi(\\mathbf{x})$ (ReLU, sigmoid, etc.):\n\n$$J_{\\mathbf{f}} = \\text{diag}(\\phi'(x_1), \\ldots, \\phi'(x_n))$$\n\neste Jacobiano diagonal es el $\\odot\\, \\sigma'(\\mathbf{z})$ que aparece en backprop: multiplicar por él es simplemente escalar cada componente del gradiente por la derivada local de la activación."
      },
      {
        label: "Determinante Jacobiano y cambio de variable",
        body: "Para $\\mathbf{f}: \\mathbb{R}^n \\to \\mathbb{R}^n$ (misma dimensión), el determinante $|\\det J_{\\mathbf{f}}(\\mathbf{x})|$ mide el factor de expansión de volumen infinitesimal:\n\n$$\\text{Vol}(\\mathbf{f}(\\Omega_\\varepsilon)) \\approx |\\det J_{\\mathbf{f}}(\\mathbf{x}_0)| \\cdot \\text{Vol}(\\Omega_\\varepsilon)$$\n\nLa fórmula de cambio de variable generaliza la sustitución de integrales:\n\n$$\\int_{\\mathbf{f}(\\Omega)} g(\\mathbf{y})\\,d\\mathbf{y} = \\int_{\\Omega} g(\\mathbf{f}(\\mathbf{x}))\\, |\\det J_{\\mathbf{f}}(\\mathbf{x})|\\, d\\mathbf{x}$$\n\nEn el contexto de **Normalizing Flows**, se aprende una transformación biyectiva $\\mathbf{f}_\\theta$ que mapea una distribución simple $p_\\mathbf{z}$ a datos complejos. La log-verosimilitud exacta requiere $\\log |\\det J_{\\mathbf{f}_\\theta}|$, lo que impone restricciones arquitectónicas (flujos triangulares, coupling layers) para calcular el determinante en $O(n)$ en lugar de $O(n^3)$."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "El Jacobiano aparece en múltiples contextos críticos en ML moderno:\n\n**Backpropagation**: cada capa $l$ contribuye con $J_{f_l}^\\top$ al producto de matrices que propaga el gradiente. Para una capa lineal $\\mathbf{a} = W\\mathbf{x}$, $J = W$, y el gradiente retropropagado es $W^\\top \\boldsymbol{\\delta}$. Para una activación diagonal, $J = \\text{diag}(\\sigma')$ y la retropropagación es el producto de Hadamard $\\boldsymbol{\\delta} \\odot \\sigma'$.\n\n**Jacobian-vector products (JVP) y VJP**: PyTorch implementa `torch.autograd.functional.jvp` y `vjp`. El VJP es el building block del modo reverso: calcula $J^\\top \\mathbf{v}$ sin materializar $J$ explícitamente, con costo $O(\\text{FLOPs del forward pass})$ independientemente de $n$.\n\n**Neural Tangent Kernel (NTK)**: el kernel de redes infinitamente anchas es $K(\\mathbf{x}, \\mathbf{x}') = J_\\theta f(\\mathbf{x}) \\cdot J_\\theta f(\\mathbf{x}')^\\top$, donde $J_\\theta f \\in \\mathbb{R}^{m \\times p}$ es el Jacobiano de las salidas respecto a todos los parámetros. El NTK determina la dinámica de entrenamiento en el régimen de ancho infinito.\n\n**Jacobian regularization**: penalizar $\\|J_{\\mathbf{f}}\\|_F^2$ en la entrada promueve robustez adversarial —un gradiente pequeño respecto a la entrada significa que pequeñas perturbaciones no cambian mucho la salida."
      },
    ],
    code: `# Python - Jacobiana: cálculo, propiedades y aplicaciones en DL
import numpy as np
import torch
import torch.nn as nn
from torch.autograd.functional import jacobian, jvp, vjp

# ── 1. Jacobiana numérica de una función vectorial ────────────────────────
def jacobiana_numerica(f, x, h=1e-5):
    """J ∈ R^{m×n} por diferencias centrales."""
    fx = np.asarray(f(x), dtype=float)
    m  = fx.size
    n  = x.size
    J  = np.zeros((m, n))
    for j in range(n):
        xp, xm = x.copy(), x.copy()
        xp[j] += h; xm[j] -= h
        J[:, j] = (np.asarray(f(xp)) - np.asarray(f(xm))) / (2*h)
    return J

# f: R³ → R² 
def f_vec(x):
    return np.array([
        np.sin(x[0]) * x[1] + x[2]**2,
        np.exp(x[0] - x[1]) * np.cos(x[2]),
    ])

x0 = np.array([0.5, 1.0, 0.8])
J_num = jacobiana_numerica(f_vec, x0)

# Jacobiana analítica
J_ana = np.array([
    [np.cos(x0[0])*x0[1],       np.sin(x0[0]),          2*x0[2]             ],
    [np.exp(x0[0]-x0[1])*np.cos(x0[2]),
     -np.exp(x0[0]-x0[1])*np.cos(x0[2]),
     -np.exp(x0[0]-x0[1])*np.sin(x0[2])],
])
print("Error máximo J numérica vs analítica:", np.max(np.abs(J_num - J_ana)))
print("J shape:", J_ana.shape, "— (m=2 filas, n=3 columnas)")

# ── 2. Jacobiana de softmax ───────────────────────────────────────────────
def softmax(z):
    e = np.exp(z - z.max())
    return e / e.sum()

def jacobiana_softmax(z):
    s = softmax(z)
    return np.diag(s) - np.outer(s, s)   # diag(σ) - σσᵀ

z0 = np.array([1.0, 2.0, 0.5, -0.3])
J_soft = jacobiana_softmax(z0)
print("\\nJacobiana Softmax (4×4):")
print(np.round(J_soft, 4))
print("Suma por filas (debe ser 0):", np.round(J_soft.sum(axis=1), 10))

# ── 3. Jacobiana con PyTorch autograd ────────────────────────────────────
def f_torch(x):
    return torch.stack([
        torch.sin(x[0]) * x[1] + x[2]**2,
        torch.exp(x[0] - x[1]) * torch.cos(x[2]),
    ])

x_t = torch.tensor(x0, dtype=torch.float64, requires_grad=False)
J_torch = jacobian(f_torch, x_t)
print("\\nJacobiana PyTorch:")
print(np.round(J_torch.numpy(), 6))
print("Coincide con analítica:", np.allclose(J_torch.numpy(), J_ana, atol=1e-5))

# ── 4. JVP (modo directo) — una columna del Jacobiano ────────────────────
u = torch.tensor([1.0, 0.0, 0.0], dtype=torch.float64)   # e₁
_, jvp_result = jvp(f_torch, (x_t,), (u,))
print("\\nJVP con u=e₁ (debe ser col 0 de J):", np.round(jvp_result.numpy(), 6))
print("Col 0 de J_ana:                      ", np.round(J_ana[:, 0], 6))

# ── 5. VJP (modo reverso) — una fila del Jacobiano transpuesto ───────────
v = torch.tensor([1.0, 0.0], dtype=torch.float64)         # e₁ de salida
_, vjp_result = vjp(f_torch, (x_t,), v)
print("\\nVJP con v=e₁ (debe ser fila 0 de J):", np.round(vjp_result[0].numpy(), 6))
print("Fila 0 de J_ana:                     ", np.round(J_ana[0, :], 6))

# ── 6. Determinante Jacobiano — cambio de volumen ─────────────────────────
# Transformación polar → cartesiana: f(r,θ) = (r cosθ, r sinθ)
def f_polar(x):
    return np.array([x[0]*np.cos(x[1]), x[0]*np.sin(x[1])])

r0, theta0 = 2.0, np.pi/4
pt = np.array([r0, theta0])
J_polar = jacobiana_numerica(f_polar, pt)
det_J   = np.linalg.det(J_polar)
print(f"\\ndet(J_polar) = {det_J:.4f}  (debe ser r = {r0})")

# ── 7. Jacobian regularization en una red neuronal ───────────────────────
torch.manual_seed(0)
net = nn.Sequential(nn.Linear(3, 8), nn.ReLU(), nn.Linear(8, 2))
x_reg = torch.randn(1, 3, requires_grad=False)

# Calcular frobenius norm del Jacobiano de salida respecto a entrada
def jac_frobenius_norm(model, x):
    x = x.detach().requires_grad_(True)
    J = jacobian(lambda v: model(v.unsqueeze(0)).squeeze(0), x)
    return torch.norm(J, p='fro').item()

jac_norm = jac_frobenius_norm(net, x_reg.squeeze(0))
print(f"\\n‖J_f‖_F (Jacobian regularization) = {jac_norm:.4f}")
`,
    related: ["Derivadas Parciales y Gradiente", "Regla de la Cadena Multivariable", "Matriz Hessiana", "Backpropagation", "Normalizing Flows", "Diferenciación Automática"],
    hasViz: true,
    vizType: "jacobianViz",
  },
  {
    id: 41,
    section: "Cálculo y Optimización: El Motor de Aprendizaje",
    sectionCode: "III",
    name: "Matriz Hessiana",
    tags: ["hessiana", "segundas derivadas", "curvatura", "punto crítico", "optimización segundo orden", "definida positiva"],
    definition: "La matriz Hessiana de una función escalar f: Rⁿ → R en un punto x₀ es la matriz simétrica de todas las derivadas parciales de segundo orden de f evaluadas en x₀, de dimensiones n×n. Cada entrada Hᵢⱼ = ∂²f/∂xᵢ∂xⱼ mide la curvatura mixta de f en las direcciones i y j. La Hessiana generaliza la segunda derivada escalar al caso multivariable: su signo definido clasifica los puntos críticos en mínimos, máximos o puntos de silla, y sus eigenvalores determinan la curvatura de la superficie de pérdida en cada dirección. En optimización de redes neuronales, la Hessiana aparece en métodos de segundo orden, análisis de paisaje de pérdida y en el estudio de la convergencia del descenso de gradiente.",
    formal: {
      notation: "Sea $f: \\mathbb{R}^n \\to \\mathbb{R}$ dos veces diferenciable en $\\mathbf{x}_0$",
      body: "H_f(\\mathbf{x}_0) = \\nabla^2 f(\\mathbf{x}_0) = \\begin{pmatrix} \\dfrac{\\partial^2 f}{\\partial x_1^2} & \\cdots & \\dfrac{\\partial^2 f}{\\partial x_1 \\partial x_n} \\\\ \\vdots & \\ddots & \\vdots \\\\ \\dfrac{\\partial^2 f}{\\partial x_n \\partial x_1} & \\cdots & \\dfrac{\\partial^2 f}{\\partial x_n^2} \\end{pmatrix} \\in \\mathbb{R}^{n \\times n}",
      geometric: "f(\\mathbf{x}_0 + \\mathbf{h}) = f(\\mathbf{x}_0) + \\nabla f(\\mathbf{x}_0)^\\top \\mathbf{h} + \\tfrac{1}{2}\\mathbf{h}^\\top H_f(\\mathbf{x}_0)\\mathbf{h} + O(\\|\\mathbf{h}\\|^3)",
      properties: [
        "\\text{Simetría (Schwarz): } H_{ij} = H_{ji} \\text{ si } f \\in C^2 \\Rightarrow H \\text{ es diagonalizable con eigenvalores reales}",
        "\\text{Clasificación: } H \\succ 0 \\Rightarrow \\text{mínimo local};\\quad H \\prec 0 \\Rightarrow \\text{máximo local};\\quad \\text{eigenvalores mixtos} \\Rightarrow \\text{punto de silla}",
        "\\text{Curvatura direccional: } \\kappa(\\mathbf{u}) = \\mathbf{u}^\\top H \\mathbf{u},\\quad \\|\\mathbf{u}\\|=1,\\quad \\kappa \\in [\\lambda_{\\min}, \\lambda_{\\max}]",
        "\\text{Radio espectral y paso óptimo GD: } \\alpha^* = 1/\\lambda_{\\max}(H);\\quad \\text{número de condición: } \\kappa(H) = \\lambda_{\\max}/\\lambda_{\\min}",
        "\\text{Paso Newton: } \\mathbf{x}^+ = \\mathbf{x} - H^{-1}\\nabla f,\\quad \\text{converge cuadráticamente cerca del mínimo}",
      ],
    },
    intuition: "Imagina que la función de pérdida es un terreno montañoso y estás parado en un punto crítico donde el terreno es plano (gradiente cero). La Hessiana es la 'curvatura' del terreno: si en todas las direcciones el terreno se curva hacia arriba estás en un valle (mínimo), si en todas se curva hacia abajo estás en una cima (máximo), y si en algunas sube y en otras baja estás en una silla de montar. Los eigenvalores de la Hessiana son las curvaturas en las direcciones principales: uno muy grande significa que la pérdida sube muy rápido en esa dirección —el gradiente es sensible— mientras que uno cercano a cero indica una dirección casi plana, donde el aprendizaje es lento.",
    development: [
      {
        label: "Construcción y simetría",
        body: "Para $f(x_1, x_2) = x_1^2 x_2 + e^{x_1 x_2}$ la Hessiana se construye derivando dos veces:\n\n$$\\frac{\\partial^2 f}{\\partial x_1^2} = 2x_2 + x_2^2 e^{x_1 x_2}, \\quad \\frac{\\partial^2 f}{\\partial x_2^2} = x_1^2 e^{x_1 x_2}$$\n\n$$\\frac{\\partial^2 f}{\\partial x_1 \\partial x_2} = 2x_1 + (1 + x_1 x_2) e^{x_1 x_2} = \\frac{\\partial^2 f}{\\partial x_2 \\partial x_1}$$\n\nEl **teorema de Schwarz** garantiza la igualdad de derivadas mixtas cuando $f \\in C^2$, haciendo $H$ simétrica. Como matriz simétrica real, $H$ es ortogonalmente diagonalizable: $H = Q \\Lambda Q^\\top$ con $Q$ ortogonal y $\\Lambda = \\text{diag}(\\lambda_1, \\ldots, \\lambda_n)$ real. Los eigenvectores de $H$ son las **direcciones principales de curvatura** y sus eigenvalores las curvaturas correspondientes."
      },
      {
        label: "Test de la segunda derivada y clasificación de puntos críticos",
        body: "En un punto crítico $\\mathbf{x}^*$ donde $\\nabla f(\\mathbf{x}^*) = \\mathbf{0}$, la naturaleza del punto queda determinada por la Hessiana $H = H_f(\\mathbf{x}^*)$:\n\n$$H \\succ 0 \\;(\\text{todos } \\lambda_i > 0) \\Rightarrow \\mathbf{x}^* \\text{ es mínimo local estricto}$$\n\n$$H \\prec 0 \\;(\\text{todos } \\lambda_i < 0) \\Rightarrow \\mathbf{x}^* \\text{ es máximo local estricto}$$\n\n$$\\exists\\, \\lambda_i > 0,\\, \\lambda_j < 0 \\Rightarrow \\mathbf{x}^* \\text{ es punto de silla}$$\n\n$$\\lambda_{\\min} = 0 \\Rightarrow \\text{test inconcluso (dirección plana)}$$\n\nPara $n=2$, el criterio simplificado usa el discriminante: $D = f_{xx}f_{yy} - f_{xy}^2 = \\det(H)$. Si $D > 0$ y $f_{xx} > 0$: mínimo; $D > 0$ y $f_{xx} < 0$: máximo; $D < 0$: punto de silla; $D = 0$: inconcluso."
      },
      {
        label: "Curvatura, número de condición y convergencia de GD",
        body: "La **curvatura direccional** de $f$ en la dirección unitaria $\\mathbf{u}$ es:\n\n$$\\kappa(\\mathbf{u}) = \\mathbf{u}^\\top H \\mathbf{u} \\in [\\lambda_{\\min}(H),\\, \\lambda_{\\max}(H)]$$\n\nEl número de condición $\\kappa(H) = \\lambda_{\\max}/\\lambda_{\\min}$ controla la convergencia del **descenso de gradiente**: en una función cuadrática convexa $f(\\mathbf{x}) = \\frac{1}{2}\\mathbf{x}^\\top H \\mathbf{x}$, el error después de $k$ pasos con tasa óptima $\\alpha = 2/(\\lambda_{\\max}+\\lambda_{\\min})$ decae como:\n\n$$\\|\\mathbf{x}_k - \\mathbf{x}^*\\| \\leq \\left(\\frac{\\kappa(H)-1}{\\kappa(H)+1}\\right)^k \\|\\mathbf{x}_0 - \\mathbf{x}^*\\|$$\n\nSi $\\kappa(H) \\gg 1$ (superficie muy alargada/elíptica), el gradiente oscila en direcciones de alta curvatura mientras avanza lentamente en las de baja curvatura —comportamiento de zigzag conocido en el entrenamiento de redes neuronales. Los métodos de **momentum** y **Adam** mitigan esto adaptando el paso por dirección."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "La Hessiana de la función de pérdida $H_{\\mathcal{L}}$ tiene $n^2$ entradas donde $n$ = número de parámetros. Para GPT-3 con $n \\approx 175 \\times 10^9$, almacenar $H$ requeriría $\\sim 10^{20}$ bytes —computacionalmente inviable. Por ello se trabaja con aproximaciones:\n\n**Método de Newton**: $\\mathbf{w}^+ = \\mathbf{w} - H^{-1}\\nabla \\mathcal{L}$. Converge cuadráticamente pero requiere $O(n^3)$ para invertir $H$. Práctico solo para modelos pequeños o capas aisladas.\n\n**L-BFGS**: aproxima $H^{-1}$ acumulando productos $\\mathbf{s}_k^\\top \\mathbf{y}_k$ de los últimos $m \\approx 20$ pasos de gradiente, con costo $O(mn)$ por iteración.\n\n**Gauss-Newton y Fisher Information**: la Hessiana de la log-verosimilitud se aproxima por la matriz de Fisher $\\mathcal{F} = \\mathbb{E}[\\nabla \\log p \\cdot \\nabla \\log p^\\top] \\approx J^\\top J$ (semidefinida positiva por construcción), base del **Natural Gradient** (Amari) y **K-FAC**.\n\n**Sharpness-Aware Minimization (SAM)**: busca mínimos con $\\lambda_{\\max}(H)$ pequeño (mínimos 'planos'), empíricamente más generalizables. La hipótesis es que mínimos agudos ($\\lambda_{\\max}$ grande) sobreajustan más.\n\n**Hessian-vector products**: PyTorch permite calcular $H\\mathbf{v}$ en $O(n)$ sin materializar $H$, via doble backprop: `torch.autograd.grad(grad_outputs=[v], ...)`."
      },
    ],
    code: `# Python - Matriz Hessiana: cálculo, eigenvalores y aplicaciones
import numpy as np
import torch

# ── 1. Hessiana numérica por diferencias finitas ──────────────────────────
def hessiana_numerica(f, x, h=1e-4):
    """H ∈ R^{n×n}, simétrica, por diferencias finitas de 2° orden."""
    n = len(x)
    H = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            xpp = x.copy(); xpp[i]+=h; xpp[j]+=h
            xpm = x.copy(); xpm[i]+=h; xpm[j]-=h
            xmp = x.copy(); xmp[i]-=h; xmp[j]+=h
            xmm = x.copy(); xmm[i]-=h; xmm[j]-=h
            H[i,j] = (f(xpp) - f(xpm) - f(xmp) + f(xmm)) / (4*h*h)
    return H

# f(x,y) = x² + 4y² + xy  (cuadrática, mínimo en origen)
f    = lambda v: v[0]**2 + 4*v[1]**2 + v[0]*v[1]
x0   = np.array([1.5, -0.8])
H    = hessiana_numerica(f, x0)
H_an = np.array([[2.0, 1.0], [1.0, 8.0]])   # Hessiana analítica (constante aquí)

print("Hessiana numérica vs analítica:")
print(np.round(H, 5)); print(H_an)
print("Simétrica:", np.allclose(H, H.T))

# ── 2. Eigenvalores y clasificación del punto crítico ────────────────────
eigvals, eigvecs = np.linalg.eigh(H_an)   # eigh garantiza eigenvalores reales
print(f"\\nEigenvalores: {np.round(eigvals, 4)}")
print(f"Eigenvectores (columnas):\\n{np.round(eigvecs, 4)}")

if np.all(eigvals > 0):   tipo = "mínimo local (H ≻ 0)"
elif np.all(eigvals < 0): tipo = "máximo local (H ≺ 0)"
elif np.any(eigvals == 0): tipo = "inconcluso (λ=0)"
else:                     tipo = "punto de silla (eigenvalores mixtos)"
print(f"Punto crítico: {tipo}")

kappa = eigvals.max() / eigvals.min()
print(f"Número de condición κ(H) = {kappa:.4f}")

# ── 3. Curvatura direccional ──────────────────────────────────────────────
def curvatura(H, u):
    """κ(u) = uᵀHu, con u unitario."""
    u = u / np.linalg.norm(u)
    return u @ H @ u

angles = np.linspace(0, np.pi, 9)
print("\\nCurvatura direccional κ(u):")
for ang in angles:
    u = np.array([np.cos(ang), np.sin(ang)])
    print(f"  θ={np.degrees(ang):5.1f}°: κ={curvatura(H_an, u):.4f}")

# ── 4. Hessiana con PyTorch (doble backprop) ──────────────────────────────
def hessiana_torch(f_torch, x_t):
    """Hessiana exacta via doble diferenciación automática."""
    x_t = x_t.detach().requires_grad_(True)
    grad = torch.autograd.grad(f_torch(x_t), x_t, create_graph=True)[0]
    n = x_t.shape[0]
    H  = torch.zeros(n, n, dtype=x_t.dtype)
    for i in range(n):
        g2 = torch.autograd.grad(grad[i], x_t, retain_graph=True)[0]
        H[i] = g2
    return H.detach().numpy()

f_t = lambda v: v[0]**2 + 4*v[1]**2 + v[0]*v[1]
x_t = torch.tensor(x0, dtype=torch.float64)
H_pt = hessiana_torch(f_t, x_t)
print("\\nHessiana PyTorch (doble backprop):")
print(np.round(H_pt, 6))

# ── 5. Hessian-vector product (HVP) en O(n) ──────────────────────────────
def hvp(f_torch, x_t, v_t):
    """Hv sin materializar H: doble backprop con semilla v."""
    x_t = x_t.detach().requires_grad_(True)
    grad = torch.autograd.grad(f_torch(x_t), x_t, create_graph=True)[0]
    Hv   = torch.autograd.grad(grad, x_t, grad_outputs=v_t)[0]
    return Hv.detach().numpy()

v = torch.tensor([1.0, 0.0], dtype=torch.float64)
Hv = hvp(f_t, x_t, v)
print(f"\\nHv (v=e₁): {np.round(Hv, 6)}  (debe ser col 0 de H: {H_an[:,0]})")

# ── 6. Paso de Newton vs GD en función cuadrática ─────────────────────────
def newton_step(x, H, grad):
    return x - np.linalg.solve(H, grad)

def grad_f(v):
    return np.array([2*v[0] + v[1], 8*v[1] + v[0]])

x_gd  = np.array([3.0, 2.0])
x_nt  = np.array([3.0, 2.0])
alpha = 1.0 / eigvals.max()          # tasa óptima GD = 1/λ_max

print("\\nPaso\\tGD\\t\\t\\t\\tNewton")
for k in range(6):
    g = grad_f(x_gd)
    print(f"  {k}\\t{np.round(x_gd,4)}\\t{np.round(x_nt,4)}")
    x_gd = x_gd - alpha * g
    x_nt = newton_step(x_nt, H_an, grad_f(x_nt))

# ── 7. Número de condición y zigzag de GD ────────────────────────────────
# Función muy mal condicionada
H_ill = np.array([[100.0, 0.0], [0.0, 0.01]])
kappa_ill = np.linalg.cond(H_ill)
alpha_ill = 1.0 / 100.0
tasa_convergencia = (kappa_ill - 1) / (kappa_ill + 1)
print(f"\\nκ(H_ill) = {kappa_ill:.1f}")
print(f"Tasa de convergencia GD ≤ {tasa_convergencia:.4f} por paso")
print(f"Pasos para reducir error a 1%: ≥ {int(np.log(0.01)/np.log(tasa_convergencia))+1}")
`,
    related: ["Derivadas Parciales y Gradiente", "Matriz Jacobiana", "Descenso de Gradiente", "Métodos de Segundo Orden", "Optimización Convexa", "Sharpness-Aware Minimization"],
    hasViz: true,
    vizType: "hessianViz",
  },
  {
    id: 42,
    section: "Cálculo y Optimización: El Motor de Aprendizaje",
    sectionCode: "III",
    name: "Aproximación por Series de Taylor",
    tags: ["series de Taylor", "aproximación polinomial", "Maclaurin", "linealización", "optimización segundo orden", "resto de Lagrange"],
    definition: "La serie de Taylor de una función f infinitamente diferenciable en un punto x₀ es la representación como suma infinita de potencias de (x−x₀) cuyos coeficientes son las derivadas sucesivas de f evaluadas en x₀, divididas por el factorial del orden. La expansión de orden k proporciona el polinomio de grado k que mejor aproxima a f localmente en x₀, en el sentido de que coincide con f y sus primeras k derivadas en ese punto. En optimización y ML, las expansiones de primer y segundo orden son fundamentales: la aproximación lineal justifica el descenso de gradiente y la cuadrática fundamenta los métodos de Newton y el análisis de convergencia de optimizadores.",
    formal: {
      notation: "Sea $f: \\mathbb{R} \\to \\mathbb{R}$ de clase $C^{k+1}$ en un entorno de $x_0$",
      body: "f(x) = \\sum_{n=0}^{k} \\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n + R_k(x) = f(x_0) + f'(x_0)(x-x_0) + \\frac{f''(x_0)}{2!}(x-x_0)^2 + \\cdots + \\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k + R_k(x)",
      geometric: "R_k(x) = \\frac{f^{(k+1)}(\\xi)}{(k+1)!}(x-x_0)^{k+1}, \\quad \\xi \\in (x_0, x) \\quad (\\text{resto de Lagrange})",
      properties: [
        "\\text{Convergencia: la serie converge a } f \\text{ en el radio de convergencia } r = \\lim_{n\\to\\infty}\\left|\\frac{a_n}{a_{n+1}}\\right|",
        "\\text{Cota del error: } |R_k(x)| \\leq \\frac{M_{k+1}}{(k+1)!}|x-x_0|^{k+1}, \\quad M_{k+1} = \\max_{\\xi}|f^{(k+1)}(\\xi)|",
        "\\text{Multivariable (orden 2): } f(\\mathbf{x}_0 + \\mathbf{h}) \\approx f(\\mathbf{x}_0) + \\nabla f^\\top \\mathbf{h} + \\tfrac{1}{2}\\mathbf{h}^\\top H_f \\mathbf{h}",
        "\\text{Unicidad: el polinomio de Taylor de grado } k \\text{ es el único polinomio de grado} \\leq k \\text{ que aproxima } f \\text{ con error } o(|x-x_0|^k)",
        "\\text{Maclaurin: caso particular } x_0=0;\\quad e^x = \\sum_{n=0}^{\\infty}\\frac{x^n}{n!},\\quad \\sin x = \\sum_{n=0}^{\\infty}\\frac{(-1)^n x^{2n+1}}{(2n+1)!}",
      ],
    },
    intuition: "Si tienes una función complicada y solo necesitas entenderla cerca de un punto, ¿para qué cargar con toda su complejidad? La serie de Taylor te permite reemplazar $f$ por un polinomio simple que la imita perfectamente en la cercanía. La aproximación de orden 1 es la recta tangente —'el mapa es plano si te acercas suficientemente'—. La de orden 2 agrega la curvatura —'el mapa es una parábola si miras un poco más lejos'—. Cada término adicional añade un nivel de detalle geométrico, extendiendo la zona donde la aproximación es válida. En ML, el gradiente es la aproximación de orden 1 de la pérdida, y la Hessiana es la corrección de orden 2 que los métodos avanzados explotan.",
    development: [
      {
        label: "Derivación y polinomios de Taylor de orden bajo",
        body: "El polinomio de Taylor de orden $k$ se construye imponiendo que coincida con $f$ en todas las derivadas hasta orden $k$ en $x_0$. Si $P_k(x) = \\sum_{n=0}^k c_n(x-x_0)^n$, entonces $P_k^{(j)}(x_0) = j!\\, c_j = f^{(j)}(x_0)$, de donde $c_j = f^{(j)}(x_0)/j!$.\n\nLos polinomios de orden bajo más usados (Maclaurin, $x_0=0$):\n\n$$e^x = 1 + x + \\frac{x^2}{2} + \\frac{x^3}{6} + \\cdots$$\n\n$$\\ln(1+x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\cdots \\quad (|x|<1)$$\n\n$$\\sigma(x) = \\frac{1}{2} + \\frac{x}{4} - \\frac{x^3}{48} + \\cdots \\quad (\\text{sigmoid})$$\n\n$$\\frac{1}{1-x} = 1 + x + x^2 + x^3 + \\cdots \\quad (|x|<1)$$\n\nEstas expansiones permiten analizar comportamientos asintóticos, derivar reglas de L'Hôpital y obtener fórmulas cerradas para esperanzas de funciones de variables aleatorias."
      },
      {
        label: "Resto de Lagrange y cotas de error",
        body: "El **resto de Lagrange** cuantifica el error de truncar la serie en orden $k$:\n\n$$R_k(x) = \\frac{f^{(k+1)}(\\xi)}{(k+1)!}(x-x_0)^{k+1}, \\quad \\xi \\in (\\min(x,x_0),\\, \\max(x,x_0))$$\n\nEsto implica que el error es $O(|x-x_0|^{k+1})$: usando un término más de la serie, el error cae con la potencia siguiente del desplazamiento. Para $|x-x_0| < 1$, añadir términos mejora la aproximación exponencialmente.\n\nEjemplo: aproximar $e^{0.1}$ con $k=3$:\n\n$$e^{0.1} \\approx 1 + 0.1 + \\frac{0.01}{2} + \\frac{0.001}{6} = 1.10516\\overline{6}$$\n\n$$|R_3| \\leq \\frac{e^{0.1}}{4!}(0.1)^4 \\approx 4.6 \\times 10^{-6}$$\n\nError real: $|e^{0.1} - 1.105167| \\approx 4.2 \\times 10^{-6}$ ✓"
      },
      {
        label: "Expansión multivariable y optimización de segundo orden",
        body: "Para $f: \\mathbb{R}^n \\to \\mathbb{R}$ de clase $C^3$, la expansión de Taylor alrededor de $\\mathbf{x}_0$ hasta orden 2 es:\n\n$$f(\\mathbf{x}_0 + \\mathbf{h}) = f(\\mathbf{x}_0) + \\nabla f(\\mathbf{x}_0)^\\top \\mathbf{h} + \\frac{1}{2}\\mathbf{h}^\\top H_f(\\mathbf{x}_0)\\mathbf{h} + O(\\|\\mathbf{h}\\|^3)$$\n\nMinimizando el modelo cuadrático respecto a $\\mathbf{h}$ (igualando gradiente a cero):\n\n$$\\nabla_{\\mathbf{h}}\\left[\\nabla f^\\top \\mathbf{h} + \\frac{1}{2}\\mathbf{h}^\\top H \\mathbf{h}\\right] = \\nabla f + H\\mathbf{h} = \\mathbf{0}$$\n\n$$\\Rightarrow \\mathbf{h}^* = -H^{-1}\\nabla f \\quad \\text{(paso de Newton)}$$\n\nEste es el fundamento del método de Newton: si la aproximación cuadrática fuera exacta, el paso de Newton llegaría al mínimo en una sola iteración. La calidad de la aproximación cuadrática —controlada por los términos de orden 3 de $f$— determina cuán rápido converge Newton en la práctica."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "La expansión de Taylor es la herramienta analítica central para justificar y analizar algoritmos de optimización en ML:\n\n**Descenso de gradiente** (orden 1): $f(\\mathbf{w} - \\alpha \\nabla f) \\approx f(\\mathbf{w}) - \\alpha \\|\\nabla f\\|^2 < f(\\mathbf{w})$ para $\\alpha$ suficientemente pequeño. La condición de Armijo/Wolfe formaliza qué tan pequeño debe ser $\\alpha$.\n\n**Análisis de la tasa de aprendizaje óptima**: expandiendo $f$ a segundo orden alrededor del mínimo $\\mathbf{w}^*$ y usando $\\nabla f(\\mathbf{w}^*)=0$:\n\n$$f(\\mathbf{w}) \\approx f(\\mathbf{w}^*) + \\frac{1}{2}(\\mathbf{w}-\\mathbf{w}^*)^\\top H(\\mathbf{w}^*)(\\mathbf{w}-\\mathbf{w}^*)$$\n\nmotivando que $\\alpha^* = 1/\\lambda_{\\max}(H)$ es el paso máximo estable.\n\n**Trust Region Methods**: en lugar de usar el paso de Newton directamente, se minimiza el modelo cuadrático de Taylor restringido a una región $\\|\\mathbf{h}\\| \\leq \\Delta$ donde la aproximación es confiable.\n\n**Activaciones y estabilidad numérica**: $\\log(1+e^x) \\approx x$ para $x \\gg 0$ y $\\approx e^x$ para $x \\ll 0$ (expansión de Taylor en los límites), motivando la implementación numéricamente estable de `log_softmax` en PyTorch.\n\n**SGLD y Langevin dynamics**: la discretización de la dinámica de Langevin usa expansión de Taylor de la log-probabilidad, conectando muestreo bayesiano con SGD con ruido."
      },
    ],
    code: `# Python - Series de Taylor: aproximación, error y aplicaciones en ML
import numpy as np
import matplotlib.pyplot as plt
from math import factorial

# ── 1. Polinomio de Taylor genérico ──────────────────────────────────────
def taylor_poly(derivadas_en_x0, x0, x, k):
    """
    Evalúa el polinomio de Taylor de orden k.
    derivadas_en_x0: lista [f(x0), f'(x0), f''(x0), ..., f^(k)(x0)]
    """
    resultado = 0.0
    h = np.asarray(x) - x0
    for n in range(k + 1):
        resultado += derivadas_en_x0[n] / factorial(n) * h**n
    return resultado

# Ejemplo: f(x) = e^x en x0=0 (Maclaurin)
x0 = 0.0
x  = np.linspace(-3, 3, 400)
derivs_exp = [1.0] * 8   # todas las derivadas de e^x en 0 son 1

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].plot(x, np.exp(x), 'w-', lw=2, label='$e^x$ exacta')
for k in [1, 2, 3, 5, 7]:
    P = taylor_poly(derivs_exp, x0, x, k)
    P_clipped = np.clip(P, -10, 15)
    axes[0].plot(x, P_clipped, '--', lw=1.5, label=f'k={k}', alpha=0.8)
axes[0].set(ylim=(-5, 12), title="Taylor de $e^x$ en $x_0=0$", xlabel='x', ylabel='y')
axes[0].legend(fontsize=8); axes[0].set_facecolor('#0b1220')

# ── 2. Cota de error y convergencia ──────────────────────────────────────
x_test = 0.5
print("Aproximaciones de e^0.5 por orden k:")
print(f"Valor exacto: {np.exp(x_test):.10f}")
for k in range(1, 9):
    approx = taylor_poly(derivs_exp, 0.0, x_test, k)
    error  = abs(np.exp(x_test) - approx)
    # Cota del resto de Lagrange: M_{k+1}/(k+1)! * |h|^{k+1}, M = e^0.5
    cota   = np.exp(x_test) / factorial(k+1) * x_test**(k+1)
    print(f"  k={k}: P_k={approx:.8f}  |error|={error:.2e}  cota={cota:.2e}")

# ── 3. Taylor de sigmoid: linealización en x0=0 ──────────────────────────
sigmoid  = lambda x: 1 / (1 + np.exp(-x))

# Derivadas de sigma en 0: sigma(0)=0.5, sigma'(0)=0.25, sigma''(0)=0
# sigma'''(0) = sigma'(0)(1-2*sigma(0))^2 - 2*sigma'(0)^2 = 0.25-0.125=... 
# Usamos diferenciación numérica
def deriv_n(f, x0, n, h=1e-4):
    """n-ésima derivada por diferencias finitas repetidas."""
    if n == 0: return f(x0)
    return (deriv_n(f, x0+h, n-1, h) - deriv_n(f, x0-h, n-1, h)) / (2*h)

sig_derivs = [deriv_n(sigmoid, 0.0, n) for n in range(6)]
print("\\nDerivadas de sigmoid en 0:", [f"{d:.4f}" for d in sig_derivs])

x_sig = np.linspace(-4, 4, 300)
print("\\nAproximaciones de sigma(1.0):")
for k in [1, 3, 5]:
    approx = taylor_poly(sig_derivs, 0.0, 1.0, k)
    print(f"  k={k}: {approx:.6f}  (exacta: {sigmoid(1.0):.6f})")

# ── 4. Taylor multivariable — modelo cuadrático y paso Newton ─────────────
# f(x,y) = (x-1)^2 + 2(y+1)^2 + 0.5*x*y   mínimo ≈ (x*,y*)
f2d   = lambda v: (v[0]-1)**2 + 2*(v[1]+1)**2 + 0.5*v[0]*v[1]
grad  = lambda v: np.array([2*(v[0]-1) + 0.5*v[1],
                             4*(v[1]+1) + 0.5*v[0]])
H_mat = np.array([[2.0, 0.5], [0.5, 4.0]])   # Hessiana constante (cuadrática)

x_curr = np.array([3.0, 2.0])

print("\\nMétodo de Newton en f(x,y):")
print(f"{'Iter':>4}  {'x':>8}  {'y':>8}  {'f(x,y)':>12}  {'‖∇f‖':>10}")
for k in range(5):
    g  = grad(x_curr)
    fv = f2d(x_curr)
    print(f"{k:>4}  {x_curr[0]:>8.4f}  {x_curr[1]:>8.4f}  {fv:>12.6f}  {np.linalg.norm(g):>10.2e}")
    h_newton = -np.linalg.solve(H_mat, g)   # h* = -H⁻¹∇f
    x_curr   = x_curr + h_newton

# ── 5. Taylor de log(1+e^x): softplus y estabilidad numérica ─────────────
softplus_naive  = lambda x: np.log(1 + np.exp(x))
softplus_stable = lambda x: np.where(x > 20, x, np.log1p(np.exp(np.minimum(x, 20))))

# Expansión de Taylor para x→±∞ justifica la implementación estable
x_large = np.array([100.0, 50.0, -100.0, -50.0])
print("\\nSoftplus - naive vs estable:")
for xi in x_large:
    try:
        naive  = softplus_naive(np.array([xi]))[0]
    except:
        naive = float('inf')
    stable = softplus_stable(np.array([xi]))[0]
    # Taylor: log(1+e^x) ≈ x para x>>0; ≈ e^x para x<<0
    taylor = xi if xi > 0 else np.exp(xi)
    print(f"  x={xi:7.1f}: naive={naive:.4f}  stable={stable:.4f}  Taylor≈{taylor:.4f}")

# ── 6. Condición de descenso (Armijo) vía Taylor orden 1 ─────────────────
def armijo_check(f, x, g, alpha, c=0.5):
    """Armijo: f(x - α∇f) ≤ f(x) - c·α·‖∇f‖²  (Taylor 1er orden)"""
    x_new  = x - alpha * g
    lhs    = f(x_new)
    rhs    = f(x) - c * alpha * np.dot(g, g)
    return lhs <= rhs, lhs, rhs

x0_arm = np.array([2.0, 1.5])
g0     = grad(x0_arm)
print("\\nCondición de Armijo para distintos α:")
for alpha in [1.0, 0.5, 0.1, 0.01]:
    ok, lhs, rhs = armijo_check(f2d, x0_arm, g0, alpha)
    print(f"  α={alpha:.3f}: {'✓' if ok else '✗'}  f_new={lhs:.4f}  rhs={rhs:.4f}")
`,
    related: ["Derivada y Reglas de Derivación", "Matriz Hessiana", "Descenso de Gradiente", "Métodos de Newton y Quasi-Newton", "Optimización Convexa", "Diferenciación Automática"],
    hasViz: true,
    vizType: "taylorApprox",
  },
  {
    id: 43,
    section: "Cálculo y Optimización: El Motor de Aprendizaje",
    sectionCode: "III",
    name: "Puntos Críticos y Puntos de Silla",
    tags: ["puntos críticos", "puntos de silla", "mínimos locales", "paisaje de pérdida", "optimización no convexa", "escapar de sillas"],
    definition: "Un punto crítico de f: Rⁿ → R es todo punto x* donde el gradiente se anula: ∇f(x*) = 0. Los puntos críticos se clasifican según la Hessiana en mínimos locales (H ≻ 0), máximos locales (H ≺ 0) y puntos de silla (eigenvalores de H con signos mixtos). En optimización de redes neuronales profundas, los puntos de silla son exponencialmente más frecuentes que los mínimos locales —en un espacio de n parámetros, la probabilidad de que todos los eigenvalores de H sean positivos decrece exponencialmente con n—. Comprender la geometría de estos puntos es esencial para diseñar optimizadores robustos y entender por qué el descenso de gradiente estocástico generaliza bien en la práctica.",
    formal: {
      notation: "Sea $f \\in C^2(\\mathbb{R}^n, \\mathbb{R})$ y $\\mathbf{x}^* \\in \\mathbb{R}^n$ con $\\nabla f(\\mathbf{x}^*) = \\mathbf{0}$",
      body: "\\mathbf{x}^* \\text{ es } \\begin{cases} \\text{mínimo local} & \\text{si } H_f(\\mathbf{x}^*) \\succ 0 \\;(\\lambda_i > 0 \\;\\forall i) \\\\ \\text{máximo local} & \\text{si } H_f(\\mathbf{x}^*) \\prec 0 \\;(\\lambda_i < 0 \\;\\forall i) \\\\ \\text{punto de silla} & \\text{si } \\exists\\, \\lambda_i > 0,\\, \\lambda_j < 0 \\\\ \\text{inconcluso} & \\text{si } \\lambda_{\\min} = 0 \\end{cases}",
      geometric: "f(\\mathbf{x}^* + \\mathbf{h}) \\approx f(\\mathbf{x}^*) + \\tfrac{1}{2}\\mathbf{h}^\\top H_f(\\mathbf{x}^*)\\mathbf{h} + O(\\|\\mathbf{h}\\|^3), \\quad \\kappa_{\\text{silla}} = \\lambda_{\\min}(H_f) < 0",
      properties: [
        "\\text{Condición necesaria (1er orden): } \\nabla f(\\mathbf{x}^*) = \\mathbf{0} \\;\\text{(no suficiente para mínimo)}",
        "\\text{Condición suficiente (2do orden): } \\nabla f(\\mathbf{x}^*)=\\mathbf{0} \\text{ y } H_f(\\mathbf{x}^*) \\succ 0 \\Rightarrow \\text{mínimo local estricto}",
        "\\text{Índice de Morse: número de eigenvalores negativos de } H_f \\text{ en } \\mathbf{x}^*; \\text{ silla de índice } k \\text{ tiene } k \\text{ dir. de descenso}",
        "\\text{Sillas estrictas: } \\lambda_{\\min}(H_f(\\mathbf{x}^*)) < 0 \\Rightarrow \\exists\\, \\mathbf{d}: f(\\mathbf{x}^*+\\varepsilon\\mathbf{d}) < f(\\mathbf{x}^*) \\;\\forall\\varepsilon>0 \\text{ pequeño}",
        "\\text{Prevalencia en DL: } P(\\text{mínimo local}) \\approx 2^{-n} \\text{ para } n \\text{ params independientes bajo modelo de campo aleatorio}",
      ],
    },
    intuition: "Imagina una silla de montar: si caminas hacia adelante subes, si caminas hacia los lados bajas. El gradiente es cero en el centro de la silla —ninguna dirección cardinalmente horizontal tiene pendiente— pero no estás en un valle ni en una cima. En redes neuronales con millones de parámetros, los puntos críticos son casi universalmente sillas de este tipo: hay unas pocas direcciones de escape hacia abajo, pero el gradiente exactamente en ese punto es cero y el optimizador puede quedarse 'atascado'. El truco es que el ruido del SGD actúa como perturbaciones aleatorias que eventualmente empujan al optimizador fuera de la silla.",
    development: [
      {
        label: "Clasificación completa y test de la segunda derivada",
        body: "Para $f: \\mathbb{R}^2 \\to \\mathbb{R}$ en un punto crítico $(x^*, y^*)$, el discriminante de la Hessiana:\n\n$$D = f_{xx}f_{yy} - f_{xy}^2 = \\det H_f$$\n\nclasifica completamente el punto:\n\n| $D$ | $f_{xx}$ | Tipo |\n|-----|---------|------|\n| $D > 0$ | $> 0$ | Mínimo local |\n| $D > 0$ | $< 0$ | Máximo local |\n| $D < 0$ | cualquiera | **Punto de silla** |\n| $D = 0$ | cualquiera | Inconcluso |\n\nEjemplos canónicos en $\\mathbb{R}^2$: $f(x,y) = x^2 + y^2$ (mínimo en origen, $D=4>0$); $f(x,y) = -(x^2+y^2)$ (máximo, $D=4>0$, $f_{xx}<0$); $f(x,y) = x^2 - y^2$ (**silla de mono**, $D=-4<0$); $f(x,y) = x^2$ (mínimo degenerado, $D=0$, inconcluso)."
      },
      {
        label: "Geometría de las sillas y direcciones de escape",
        body: "Un punto de silla estricto $\\mathbf{x}^*$ tiene al menos un eigenvalor negativo $\\lambda_k < 0$ de $H_f(\\mathbf{x}^*)$. El eigenvector asociado $\\mathbf{v}_k$ es la **dirección de escape**: moverse en esa dirección desciende $f$:\n\n$$f(\\mathbf{x}^* + \\varepsilon \\mathbf{v}_k) \\approx f(\\mathbf{x}^*) + \\frac{\\varepsilon^2}{2}\\lambda_k < f(\\mathbf{x}^*)$$\n\nEl **índice de Morse** de la silla es el número de eigenvalores negativos. Una silla de índice 1 (un solo eigenvalor negativo) tiene exactamente una dirección de descenso —es la más común y más difícil de escapar— mientras que una de índice $k$ tiene $k$ direcciones de descenso.\n\nEn DL, el paisaje de pérdida típico tiene sillas de índice bajo concentradas en valores de pérdida altos (inicio del entrenamiento) y sillas de índice alto —o mínimos— en valores bajos. El SGD navega este paisaje gracias al ruido de los mini-batches, que actúa como perturbaciones que revelan las direcciones de escape."
      },
      {
        label: "Prevalencia de sillas en alta dimensión y SGD como escape",
        body: "Sea $f: \\mathbb{R}^n \\to \\mathbb{R}$ con puntos críticos modelados por matrices aleatorias simétricas (GOE). La fracción esperada de puntos críticos que son mínimos locales decae exponencialmente:\n\n$$\\mathbb{E}\\left[\\frac{\\text{# mínimos}}{\\text{# críticos}}\\right] \\approx e^{-\\beta n}$$\n\npara alguna constante $\\beta > 0$. En la práctica, para $n \\sim 10^8$ parámetros, esencialmente todos los puntos críticos son sillas.\n\nSin embargo, la **hipótesis de Benigna de Dauphin et al. (2014)** postula que en redes profundas, los mínimos locales tienen valores de pérdida similares al mínimo global, y las sillas de alto índice están asociadas a pérdidas altas. Esto significa que el optimizador no necesita encontrar el mínimo global: cualquier mínimo local es suficientemente bueno.\n\nEl **SGD escapa de sillas** gracias al ruido de estimación del gradiente:\n\n$$\\mathbf{g}_t = \\nabla f(\\mathbf{w}_t) + \\boldsymbol{\\xi}_t, \\quad \\boldsymbol{\\xi}_t \\sim \\mathcal{N}(\\mathbf{0}, \\Sigma)$$\n\nCerca de una silla estricta, $\\nabla f \\approx \\mathbf{0}$ pero $\\boldsymbol{\\xi}_t \\neq \\mathbf{0}$: el ruido proyectado sobre la dirección de escape $\\mathbf{v}_k$ genera una componente que empuja al optimizador lejos de la silla."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "La geometría de puntos críticos es central para entender el entrenamiento de redes neuronales:\n\n**Loss landscape de redes profundas**: visualizaciones como las de Li et al. (2018) usando proyección aleatoria de 2D muestran que las redes con skip connections (ResNets) tienen paisajes de pérdida mucho más lisos y convexos que las redes sin ellas, con menos puntos de silla pronunciados.\n\n**Saddle-Free Newton (Dauphin et al., 2014)**: modifica el paso de Newton para escapar de sillas usando el valor absoluto de los eigenvalores:\n\n$$\\mathbf{w}^+ = \\mathbf{w} - (|H|)^{-1}\\nabla f, \\quad |H| = Q|\\Lambda|Q^\\top$$\n\nInvierte el signo en direcciones negativas, convirtiendo el descenso en ascenso local para escapar.\n\n**Sharpness y generalización**: los mínimos 'planos' (con $\\lambda_{\\max}(H)$ pequeño) generalizan mejor que los 'agudos'. SAM (Sharpness-Aware Minimization) busca explícitamente mínimos planos perturbando los pesos en la dirección del gradiente antes de actualizar.\n\n**Batch normalization**: actúa como regularizador del paisaje de pérdida, suavizando las curvaturas y reduciendo la sharpness de los puntos críticos encontrados durante el entrenamiento.\n\n**Puntos de silla en embeddings**: en word2vec y modelos de lenguaje, los embeddings óptimos a menudo corresponden a puntos de silla del objetivo de entrenamiento —no a mínimos— lo que requiere técnicas de optimización específicas como negative sampling."
      },
    ],
    code: `# Python - Puntos críticos, clasificación y escape de sillas
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize

# ── 1. Encontrar y clasificar puntos críticos ────────────────────────────
def clasificar_critico(H):
    """Clasifica un punto crítico según los eigenvalores de H."""
    eigvals = np.linalg.eigvalsh(H)
    if np.all(eigvals > 1e-8):
        return "Mínimo local", eigvals
    elif np.all(eigvals < -1e-8):
        return "Máximo local", eigvals
    elif np.any(eigvals > 1e-8) and np.any(eigvals < -1e-8):
        return f"Punto de silla (índice={np.sum(eigvals<0)})", eigvals
    else:
        return "Inconcluso (λ≈0)", eigvals

# f(x,y) = x³ - 3x + y² - 2y  →  puntos críticos analíticos
f    = lambda v: v[0]**3 - 3*v[0] + v[1]**2 - 2*v[1]
grad = lambda v: np.array([3*v[0]**2 - 3, 2*v[1] - 2])
H_fn = lambda v: np.array([[6*v[0], 0.0], [0.0, 2.0]])

# Puntos críticos: grad=0 → x=±1, y=1
criticos = [np.array([-1.0, 1.0]), np.array([1.0, 1.0])]
print("Clasificación de puntos críticos:")
for xc in criticos:
    tipo, eigs = clasificar_critico(H_fn(xc))
    print(f"  x*={xc}: f(x*)={f(xc):.3f}  λ={np.round(eigs,3)}  → {tipo}")

# ── 2. Función con silla de mono: f(x,y) = x² - y² ──────────────────────
f_silla = lambda v: v[0]**2 - v[1]**2
grad_s  = lambda v: np.array([2*v[0], -2*v[1]])
H_silla = np.array([[2.0, 0.0], [0.0, -2.0]])

tipo_s, eigs_s = clasificar_critico(H_silla)
print(f"\\nSilla de mono en origen: {tipo_s}, λ={eigs_s}")
print(f"Dirección de escape (eigvec λ<0): {np.array([0,1])}")

# ── 3. GD queda atascado en silla; SGD escapa ────────────────────────────
np.random.seed(42)

def gd_trajectory(grad_fn, x0, lr=0.1, steps=100, noise=0.0):
    """Descenso de gradiente con ruido opcional (SGD)."""
    traj = [x0.copy()]
    x    = x0.copy()
    for _ in range(steps):
        g = grad_fn(x) + noise * np.random.randn(len(x))
        x = x - lr * g
        traj.append(x.copy())
    return np.array(traj)

# Función con silla en origen: f(x,y) = x^4/4 - x^2/2 + y^2
# Mínimos en (±1,0), silla en (0,0)
f_double = lambda v: v[0]**4/4 - v[0]**2/2 + v[1]**2
grad_d   = lambda v: np.array([v[0]**3 - v[0], 2*v[1]])

x_init = np.array([0.05, 2.0])   # cerca de la silla
traj_gd  = gd_trajectory(grad_d, x_init, lr=0.05, steps=200, noise=0.0)
traj_sgd = gd_trajectory(grad_d, x_init, lr=0.05, steps=200, noise=0.15)

print("\\nGD final:", np.round(traj_gd[-1], 4),
      "  f=", round(f_double(traj_gd[-1]), 4))
print("SGD final:", np.round(traj_sgd[-1], 4),
      "  f=", round(f_double(traj_sgd[-1]), 4))
print("Mínimos reales: (±1, 0), f=−0.25")

# ── 4. Detección numérica de tipo de punto crítico ──────────────────────
def analizar_critico_numerico(f, xc, h=1e-4, tol=1e-6):
    """Verifica si xc es punto crítico y lo clasifica."""
    n = len(xc)
    # Gradiente numérico
    g = np.zeros(n)
    for j in range(n):
        xp, xm = xc.copy(), xc.copy()
        xp[j]+=h; xm[j]-=h
        g[j] = (f(xp) - f(xm))/(2*h)
    # Hessiana numérica
    H = np.zeros((n,n))
    for i in range(n):
        for j in range(n):
            xpp=xc.copy(); xpp[i]+=h; xpp[j]+=h
            xpm=xc.copy(); xpm[i]+=h; xpm[j]-=h
            xmp=xc.copy(); xmp[i]-=h; xmp[j]+=h
            xmm=xc.copy(); xmm[i]-=h; xmm[j]-=h
            H[i,j]=(f(xpp)-f(xpm)-f(xmp)+f(xmm))/(4*h*h)
    es_critico = np.linalg.norm(g) < tol
    tipo, eigvals = clasificar_critico(H)
    return {'critico': es_critico, 'grad_norm': np.linalg.norm(g),
            'tipo': tipo, 'eigvals': eigvals, 'H': H}

# Función de Rosenbrock: mínimo en (1,1) — difícil para GD
rosenbrock = lambda v: (1-v[0])**2 + 100*(v[1]-v[0]**2)**2
xc_rosen   = np.array([1.0, 1.0])
res = analizar_critico_numerico(rosenbrock, xc_rosen)
print(f"\\nRosenbrock en (1,1): {res['tipo']}")
print(f"  λ = {np.round(res['eigvals'], 2)}")
print(f"  κ(H) = {res['eigvals'].max()/res['eigvals'].min():.1f}  (muy mal condicionado)")

# ── 5. Índice de Morse en función multivariable ──────────────────────────
def indice_morse(H):
    return int(np.sum(np.linalg.eigvalsh(H) < 0))

# Sillas de distintos índices en R³
H_idx0 = np.diag([ 2.0,  3.0,  1.5])   # mínimo (índice 0)
H_idx1 = np.diag([-1.0,  2.0,  3.0])   # silla índice 1
H_idx2 = np.diag([-1.0, -2.0,  3.0])   # silla índice 2
H_idx3 = np.diag([-1.0, -2.0, -0.5])   # máximo (índice 3)

for H_ex, nombre in zip([H_idx0,H_idx1,H_idx2,H_idx3],
                         ['Mínimo','Silla-1','Silla-2','Máximo']):
    print(f"  {nombre}: índice Morse = {indice_morse(H_ex)}")

# ── 6. Saddle-Free Newton (paso modificado) ───────────────────────────────
def saddle_free_newton_step(grad, H):
    """Usa |H|⁻¹ en lugar de H⁻¹ para escapar de sillas."""
    eigvals, Q = np.linalg.eigh(H)
    abs_eigvals = np.abs(eigvals)
    # Evitar división por cero
    abs_eigvals = np.maximum(abs_eigvals, 1e-6)
    H_abs_inv = Q @ np.diag(1.0/abs_eigvals) @ Q.T
    return -H_abs_inv @ grad

xc_silla = np.array([0.01, 0.01])   # cerca de silla
g_silla  = grad_d(xc_silla)
H_silla2 = np.array([[3*xc_silla[0]**2-1, 0],[0,2.0]])

h_newton = -np.linalg.solve(H_silla2, g_silla) if np.linalg.det(H_silla2)!=0 else g_silla
h_sfn    = saddle_free_newton_step(g_silla, H_silla2)
print(f"\\nEn silla (0.01, 0.01) de f=x⁴/4-x²/2+y²:")
print(f"  Newton clásico: Δw = {np.round(h_newton,4)}")
print(f"  Saddle-Free N:  Δw = {np.round(h_sfn,4)}  ← escapa en dir. correcta")
`,
    related: ["Derivadas Parciales y Gradiente", "Matriz Hessiana", "Descenso de Gradiente", "Optimización Convexa", "Métodos de Newton y Quasi-Newton", "Sharpness-Aware Minimization"],
    hasViz: true,
    vizType: "criticalPoints",
  },
  {
    id: 44,
    section: "Cálculo y Optimización: El Motor de Aprendizaje",
    sectionCode: "III",
    name: "Condiciones KKT y Multiplicadores de Lagrange",
    tags: ["KKT", "multiplicadores de Lagrange", "optimización restringida", "condiciones de optimalidad", "dualidad", "SVM"],
    definition: "Los multiplicadores de Lagrange y las condiciones de Karush-Kuhn-Tucker (KKT) son el marco formal para resolver problemas de optimización con restricciones. Dada una función objetivo f a minimizar sujeta a restricciones de igualdad hᵢ(x)=0 y de desigualdad gⱼ(x)≤0, el Lagrangiano L(x,λ,μ) incorpora estas restricciones mediante multiplicadores escalares. Las condiciones KKT son condiciones necesarias de optimalidad de primer orden que generalizan la condición ∇f=0 al caso restringido: en el óptimo, el gradiente de f debe ser combinación lineal de los gradientes de las restricciones activas. Para problemas convexos, las KKT son además suficientes.",
    formal: {
      notation: "Sea $\\min_{\\mathbf{x}\\in\\mathbb{R}^n} f(\\mathbf{x})$ sujeto a $h_i(\\mathbf{x})=0,\\; i=1,\\ldots,p$ y $g_j(\\mathbf{x})\\leq 0,\\; j=1,\\ldots,q$",
      body: "\\mathcal{L}(\\mathbf{x},\\boldsymbol{\\lambda},\\boldsymbol{\\mu}) = f(\\mathbf{x}) + \\sum_{i=1}^{p}\\lambda_i h_i(\\mathbf{x}) + \\sum_{j=1}^{q}\\mu_j g_j(\\mathbf{x})",
      geometric: "\\nabla_{\\mathbf{x}}\\mathcal{L} = \\mathbf{0} \\iff \\nabla f(\\mathbf{x}^*) = -\\sum_i \\lambda_i \\nabla h_i(\\mathbf{x}^*) - \\sum_j \\mu_j \\nabla g_j(\\mathbf{x}^*)",
      properties: [
        "\\text{Estacionariedad: } \\nabla_{\\mathbf{x}}\\mathcal{L}(\\mathbf{x}^*,\\boldsymbol{\\lambda}^*,\\boldsymbol{\\mu}^*) = \\mathbf{0}",
        "\\text{Factibilidad primal: } h_i(\\mathbf{x}^*)=0\\;\\forall i,\\quad g_j(\\mathbf{x}^*)\\leq 0\\;\\forall j",
        "\\text{Factibilidad dual: } \\mu_j^* \\geq 0\\;\\forall j \\quad (\\text{solo restricciones de desigualdad})",
        "\\text{Holgura complementaria: } \\mu_j^* g_j(\\mathbf{x}^*) = 0\\;\\forall j \\quad (\\text{restricción activa } \\Leftrightarrow \\mu_j^*>0)",
        "\\text{Suficiencia (convexo): si } f,g_j \\text{ convexas y } h_i \\text{ afines, KKT} \\Rightarrow \\text{óptimo global}",
      ],
    },
    intuition: "Imagina que quieres escalar la montaña más alta dentro de un parque nacional delimitado por una valla circular. Sin la valla llegarías al pico global, pero con ella podrías terminar en la valla misma si el pico está fuera. En el óptimo sobre la valla, el gradiente de la altitud debe apuntar directamente hacia adentro de la valla —no puede tener componente tangencial a la valla, porque entonces podrías mejorar moviéndote a lo largo de ella. El multiplicador de Lagrange $\\lambda$ mide exactamente cuánto ganarías si pudieras expandir la valla: es el 'precio sombra' de la restricción. La holgura complementaria dice que o bien estás en la valla ($g=0$) o la valla no importa ($\\mu=0$), nunca ambas restricciones activas e inactivas simultáneamente.",
    development: [
      {
        label: "Multiplicadores de Lagrange: solo igualdades",
        body: "Para $\\min f(\\mathbf{x})$ sujeto a $h(\\mathbf{x}) = 0$, la condición geométrica de optimalidad es que $\\nabla f$ y $\\nabla h$ sean paralelos en $\\mathbf{x}^*$: de lo contrario existiría una dirección tangente a la restricción que disminuye $f$.\n\nFormalmente, se introduce el **Lagrangiano** $\\mathcal{L}(\\mathbf{x},\\lambda) = f(\\mathbf{x}) + \\lambda h(\\mathbf{x})$ y se buscan sus puntos estacionarios:\n\n$$\\nabla_{\\mathbf{x}}\\mathcal{L} = \\nabla f + \\lambda \\nabla h = \\mathbf{0}$$\n$$\\nabla_{\\lambda}\\mathcal{L} = h(\\mathbf{x}) = 0$$\n\nEl sistema de $n+1$ ecuaciones con $n+1$ incógnitas $(\\mathbf{x}, \\lambda)$ determina los candidatos a óptimo. El multiplicador $\\lambda^*$ tiene interpretación económica directa:\n\n$$\\lambda^* = -\\frac{df^*}{dc}$$\n\ndonde $c$ es el lado derecho de $h(\\mathbf{x}) = c$: mide cuánto cambia el valor óptimo si se relaja marginalmente la restricción."
      },
      {
        label: "Condiciones KKT completas: desigualdades y holgura complementaria",
        body: "Con restricciones de desigualdad $g_j(\\mathbf{x}) \\leq 0$, la condición de **holgura complementaria** es la clave:\n\n$$\\mu_j^* g_j(\\mathbf{x}^*) = 0 \\quad \\forall j$$\n\nEsto significa exactamente una de dos cosas para cada restricción:\n- **Restricción activa**: $g_j(\\mathbf{x}^*) = 0$ y $\\mu_j^* > 0$ — la restricción 'toca' el óptimo y tiene precio sombra positivo\n- **Restricción inactiva**: $g_j(\\mathbf{x}^*) < 0$ y $\\mu_j^* = 0$ — la restricción no toca el óptimo y se puede ignorar\n\nLas cuatro condiciones KKT juntas:\n\n$$\\nabla f(\\mathbf{x}^*) + \\sum_i \\lambda_i^* \\nabla h_i(\\mathbf{x}^*) + \\sum_j \\mu_j^* \\nabla g_j(\\mathbf{x}^*) = \\mathbf{0}$$\n$$h_i(\\mathbf{x}^*) = 0 \\;\\forall i, \\quad g_j(\\mathbf{x}^*) \\leq 0 \\;\\forall j$$\n$$\\mu_j^* \\geq 0 \\;\\forall j, \\quad \\mu_j^* g_j(\\mathbf{x}^*) = 0 \\;\\forall j$$\n\nLa condición de **calificación de restricciones** (constraint qualification, CQ) —como la de Slater para problemas convexos o LICQ para el caso general— garantiza que las KKT sean condiciones necesarias."
      },
      {
        label: "Dualidad de Lagrange y gap de dualidad",
        body: "La **función dual de Lagrange** se define como el ínfimo del Lagrangiano respecto a $\\mathbf{x}$:\n\n$$d(\\boldsymbol{\\lambda}, \\boldsymbol{\\mu}) = \\inf_{\\mathbf{x}} \\mathcal{L}(\\mathbf{x}, \\boldsymbol{\\lambda}, \\boldsymbol{\\mu})$$\n\nSiempre es cóncava (independientemente de la convexidad de $f$) y proporciona una cota inferior del problema primal: $d(\\boldsymbol{\\lambda}, \\boldsymbol{\\mu}) \\leq f(\\mathbf{x}^*)$ para todo $\\boldsymbol{\\mu} \\geq \\mathbf{0}$.\n\nEl **problema dual** maximiza esta cota:\n\n$$\\max_{\\boldsymbol{\\lambda},\\, \\boldsymbol{\\mu}\\geq\\mathbf{0}} d(\\boldsymbol{\\lambda},\\boldsymbol{\\mu})$$\n\nEl **gap de dualidad** es $f(\\mathbf{x}^*) - d^*$. Bajo la **condición de Slater** (existe $\\mathbf{x}$ factible estrictamente: $g_j(\\mathbf{x})<0\\;\\forall j$) para problemas convexos, el gap es cero (**dualidad fuerte**) y los puntos KKT son exactamente los pares primales-duales óptimos."
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "Las KKT y la dualidad de Lagrange son el sustrato matemático de varios algoritmos fundamentales en ML:\n\n**Support Vector Machine (SVM)**: el problema primal $\\min_{\\mathbf{w},b,\\boldsymbol{\\xi}} \\frac{1}{2}\\|\\mathbf{w}\\|^2 + C\\sum_i \\xi_i$ con restricciones $y_i(\\mathbf{w}^\\top\\mathbf{x}_i+b) \\geq 1-\\xi_i$, $\\xi_i \\geq 0$ tiene dual:\n\n$$\\max_{\\boldsymbol{\\alpha}} \\sum_i \\alpha_i - \\frac{1}{2}\\sum_{i,j}\\alpha_i\\alpha_j y_i y_j \\mathbf{x}_i^\\top\\mathbf{x}_j \\quad \\text{s.t.} \\quad 0\\leq\\alpha_i\\leq C,\\; \\sum_i\\alpha_i y_i=0$$\n\nLa holgura complementaria revela que solo los **vectores soporte** ($\\alpha_i > 0$, puntos en o dentro del margen) contribuyen a la decisión. El **truco del kernel** reemplaza $\\mathbf{x}_i^\\top\\mathbf{x}_j$ por $\\kappa(\\mathbf{x}_i,\\mathbf{x}_j)$ sin cambiar la estructura dual.\n\n**Regularización como restricción**: el problema $\\min \\mathcal{L}(\\mathbf{w})$ s.t. $\\|\\mathbf{w}\\|^2 \\leq r$ es equivalente (via KKT) al problema regularizado $\\min \\mathcal{L}(\\mathbf{w}) + \\lambda\\|\\mathbf{w}\\|^2$ donde $\\lambda^* = \\mu^*$ es el multiplicador dual.\n\n**Programación cuadrática en fine-tuning**: RLHF usa PPO con restricciones de política (KL-divergence $\\leq \\delta$), que se resuelve via multiplicadores de Lagrange duales adaptativos.\n\n**Attention con restricción de normalización**: el softmax es la solución al problema $\\max \\mathbf{a}^\\top\\mathbf{z} - \\mathbf{a}^\\top\\log\\mathbf{a}$ s.t. $\\sum_i a_i = 1$, $a_i\\geq 0$, cuyas KKT dan exactamente $a_i = e^{z_i}/\\sum_j e^{z_j}$."
      },
    ],
    code: `# Python - KKT, Lagrange y aplicaciones en ML
import numpy as np
from scipy.optimize import minimize, LinearConstraint, NonlinearConstraint

# ── 1. Multiplicadores de Lagrange: mínimo en círculo ────────────────────
# min f(x,y) = (x-2)² + (y-1)²  s.t.  x² + y² = 1
# Lagrangiano: L = f + λ(x²+y²-1)
# KKT: ∇f + λ∇h = 0  →  (2(x-2)+2λx, 2(y-1)+2λy) = 0
# Solución analítica: x* = 2/(√5), y* = 1/(√5), λ* = 1 - √5

f    = lambda v: (v[0]-2)**2 + (v[1]-1)**2
h    = lambda v: v[0]**2 + v[1]**2 - 1     # restricción igualdad

# Solución analítica
x_star = np.array([2/np.sqrt(5), 1/np.sqrt(5)])
lam_star = 1 - np.sqrt(5)
print("── Multiplicadores de Lagrange ──")
print(f"x* = ({x_star[0]:.4f}, {x_star[1]:.4f})")
print(f"λ* = {lam_star:.4f}")
print(f"f(x*) = {f(x_star):.4f}")
print(f"h(x*) = {h(x_star):.6f}  (debe ser 0)")

# Verificar condición KKT: ∇f + λ∇h = 0
grad_f  = np.array([2*(x_star[0]-2), 2*(x_star[1]-1)])
grad_h  = np.array([2*x_star[0], 2*x_star[1]])
kkt_res = grad_f + lam_star * grad_h
print(f"‖∇f + λ∇h‖ = {np.linalg.norm(kkt_res):.2e}  (debe ser ≈ 0)")

# Precio sombra: si radio = 1+ε, f* mejora en λ*·ε
eps = 0.01
f_relajado = (2/np.sqrt(5*(1+eps)**(-2))-2)**2  # aproximado
print(f"Precio sombra: Δf*/Δc ≈ {lam_star:.4f}")

# ── 2. KKT con desigualdades — verificación numérica ──────────────────────
# min f(x,y) = x² + y²  s.t.  x+y >= 1  (g: 1-x-y <= 0)
# KKT: (2x,2y) + μ(-1,-1) = 0  →  x*=y*=1/2, μ*=1

f2   = lambda v: v[0]**2 + v[1]**2
g2   = lambda v: 1 - v[0] - v[1]   # g ≤ 0

x2   = np.array([0.5, 0.5])
mu2  = 1.0  # multiplicador dual
grad_f2 = np.array([2*x2[0], 2*x2[1]])
grad_g2 = np.array([-1.0, -1.0])

print("\n── KKT con desigualdad ──")
print(f"x* = {x2}, f(x*) = {f2(x2):.4f}")
print(f"g(x*) = {g2(x2):.4f}  (restricción activa, g=0)")
print(f"μ* = {mu2:.4f}  ≥ 0  ✓")
print(f"μ*·g(x*) = {mu2*g2(x2):.4f}  (holgura complementaria = 0) ✓")
print(f"‖∇f + μ∇g‖ = {np.linalg.norm(grad_f2 + mu2*grad_g2):.2e}  ✓")

# ── 3. SVM: dual de Lagrange y vectores soporte ───────────────────────────
from sklearn.svm import SVC
from sklearn.datasets import make_classification

np.random.seed(0)
X, y = make_classification(n_samples=40, n_features=2, n_redundant=0,
                           n_clusters_per_class=1, random_state=42)
y = 2*y - 1   # labels ∈ {-1, +1}

svm = SVC(kernel='linear', C=1.0)
svm.fit(X, y)

print("\n── SVM — KKT y vectores soporte ──")
print(f"Vectores soporte: {svm.n_support_} por clase")
print(f"‖w‖ = {np.linalg.norm(svm.coef_):.4f}, margen = {2/np.linalg.norm(svm.coef_):.4f}")

# Dual: αᵢ = svm.dual_coef_ * yᵢ
alpha = np.abs(svm.dual_coef_).flatten()
print(f"αᵢ en {alpha.min():.4f}…{alpha.max():.4f}  (solo SVs tienen α>0)")

# Verificar KKT: w = Σ αᵢ yᵢ xᵢ  (vectores soporte)
sv_indices = svm.support_
w_recalc = sum(svm.dual_coef_[0,k] * X[sv_indices[k]]
               for k in range(len(sv_indices)))
print(f"w via dual:  {np.round(w_recalc,4)}")
print(f"w via primal:{np.round(svm.coef_[0],4)}")

# ── 4. Regularización L2 como restricción (equivalencia KKT) ─────────────
# min ‖Xw−y‖²  s.t.  ‖w‖² ≤ r   ←→   min ‖Xw−y‖² + λ‖w‖²
np.random.seed(1)
n_s, p = 50, 10
X_r = np.random.randn(n_s, p)
w_t = np.random.randn(p) * 0.5
y_r = X_r @ w_t + 0.1*np.random.randn(n_s)

# Ridge (forma regularizada): w* = (X'X + λI)⁻¹ X'y
lam_ridge = 1.0
w_ridge = np.linalg.solve(X_r.T@X_r + lam_ridge*np.eye(p), X_r.T@y_r)

# Radio equivalente: ‖w_ridge‖² = r*
r_equiv = np.linalg.norm(w_ridge)**2
print(f"\n── Ridge ↔ restricción L2 ──")
print(f"λ_ridge = {lam_ridge},  ‖w*‖² = {r_equiv:.4f}  (radio equivalente)")
print(f"μ* (mult. dual) = λ_ridge = {lam_ridge}  (por KKT)")

# ── 5. Softmax como problema KKT ──────────────────────────────────────────
# max aᵀz - aᵀlog(a)  s.t.  Σaᵢ=1, aᵢ≥0
# KKT: zᵢ - log(aᵢ) - 1 - λ = 0 + μᵢ=0 → aᵢ = exp(zᵢ-1-λ) → softmax
z = np.array([2.0, 1.0, 0.5, -0.3])
softmax = lambda v: np.exp(v-v.max()) / np.exp(v-v.max()).sum()
a_star = softmax(z)
print(f"\n── Softmax como KKT ──")
print(f"z = {z}")
print(f"a* = {np.round(a_star,4)}  (solución KKT del problema de entropía)")
print(f"Σaᵢ = {a_star.sum():.6f}  ✓")
print(f"KKT: zᵢ−log(aᵢ*)−1 = {np.round(z-np.log(a_star)-1,4)}  (debe ser constante=λ*)")
`,
    related: ["Optimización Convexa", "Descenso de Gradiente", "Puntos Críticos y Puntos de Silla", "Support Vector Machine", "Regularización L1 y L2", "Dualidad y Programación Cuadrática"],
    hasViz: true,
    vizType: "kktViz",
  },
  {
    id: 45,
    section: "Cálculo y Optimización: El Motor de Aprendizaje",
    sectionCode: "III",
    name: "Función de Pérdida (Loss Function)",
    tags: ["función de pérdida", "MSE", "cross-entropy", "Huber", "log-verosimilitud", "calibración"],
    definition: "La función de pérdida ℓ(ŷ, y) cuantifica la discrepancia entre la predicción ŷ de un modelo y el valor verdadero y, proporcionando la señal escalar que el optimizador minimiza durante el entrenamiento. La elección de la pérdida no es arbitraria: debe ser coherente con la distribución asumida sobre los datos (principio de máxima verosimilitud), diferenciable casi en todas partes para permitir backpropagation, y sensible a las propiedades que importan en la tarea. La función de pérdida total sobre el conjunto de entrenamiento es L(θ) = (1/n)Σᵢ ℓ(f(xᵢ;θ), yᵢ), cuyo gradiente respecto a los parámetros θ dirige la actualización del modelo.",
    formal: {
      notation: "Sean $\\hat{y} = f(\\mathbf{x};\\boldsymbol{\\theta}) \\in \\mathcal{Y}$ la predicción y $y \\in \\mathcal{Y}$ el objetivo; $\\mathcal{L}(\\boldsymbol{\\theta}) = \\frac{1}{n}\\sum_{i=1}^n \\ell(\\hat{y}_i, y_i)$",
      body: "\\ell_{\\text{MSE}}(\\hat{y},y) = (\\hat{y}-y)^2 \\quad \\ell_{\\text{CE}}(\\hat{\\mathbf{p}},y) = -\\log \\hat{p}_y \\quad \\ell_{\\text{Huber}}(r) = \\begin{cases} \\frac{1}{2}r^2 & |r|\\leq\\delta \\\\ \\delta|r|-\\frac{\\delta^2}{2} & |r|>\\delta \\end{cases}",
      geometric: "-\\log p(y\\mid\\mathbf{x};\\boldsymbol{\\theta}) \\xrightarrow{\\text{minimizar}} \\text{máxima verosimilitud} \\iff \\text{minimizar } \\ell \\text{ derivada de } p",
      properties: [
        "\\text{MLE} \\Leftrightarrow \\text{pérdida: Gaussiana}\\to\\text{MSE};\\quad \\text{Bernoulli}\\to\\text{BCE};\\quad \\text{Laplace}\\to\\text{MAE};\\quad \\text{Categórica}\\to\\text{CE}",
        "\\text{Convexidad: MSE, BCE, CE son convexas en } \\hat{y};\\text{ facilitan optimización global en modelos lineales}",
        "\\text{Robustez: MAE y Huber son menos sensibles a outliers que MSE } (\\nabla_{\\text{MSE}} = 2r \\text{ crece ilimitado)}",
        "\\text{Calibración: } -\\log\\hat{p}_y \\text{ penaliza más la confianza errónea que la incertidumbre, promoviendo probabilidades calibradas}",
        "\\text{Gradiente BCE: } \\partial\\ell/\\partial\\hat{p} = -1/\\hat{p} \\text{ (diverge en 0); en práctica se usa log-sum-exp numéricamente estable}",
      ],
    },
    intuition: "La función de pérdida es el 'termómetro' del aprendizaje: convierte el error del modelo en un número que el optimizador puede bajar. Cada pérdida cuenta una historia diferente: el MSE castiga los errores grandes desproporcionadamente (al cuadrado), lo que lo hace sensible a valores atípicos pero útil cuando los errores grandes son realmente costosos. La entropía cruzada castiga la confianza equivocada de forma logarítmica —si predices 99% de probabilidad para la clase incorrecta, pagas un precio enorme— promoviendo predicciones calibradas. El Huber es el 'mejor de ambos mundos': cuadrático para errores pequeños (suave) y lineal para errores grandes (robusto).",
    development: [
      {
        label: "Pérdidas para regresión: MSE, MAE y Huber",
        body: "Para $y \\in \\mathbb{R}$, el residuo $r = \\hat{y} - y$ determina las pérdidas de regresión:\n\n**MSE** (Error cuadrático medio): $\\ell = r^2$, gradiente $\\nabla = 2r$. Derivado de la asunción $y \\sim \\mathcal{N}(\\hat{y}, \\sigma^2)$ via MLE. Penaliza errores grandes cuadráticamente, lo que lo hace óptimo cuando los outliers son raros y los errores grandes muy costosos.\n\n**MAE** (Error absoluto medio): $\\ell = |r|$, gradiente $\\nabla = \\text{sign}(r)$. Derivado de $y \\sim \\text{Laplace}(\\hat{y}, b)$. El estimador es la mediana condicional, más robusto a outliers. Gradiente constante en magnitud puede ralentizar la convergencia cerca del mínimo.\n\n**Huber**: combina ambos con umbral $\\delta$:\n\n$$\\ell_\\delta(r) = \\begin{cases} \\frac{1}{2}r^2 & |r| \\leq \\delta \\\\ \\delta(|r| - \\frac{\\delta}{2}) & |r| > \\delta \\end{cases}$$\n\nGradiente: $\\nabla = r$ si $|r| \\leq \\delta$, $\\nabla = \\delta\\,\\text{sign}(r)$ si $|r| > \\delta$. Suave en el origen (permite convergencia rápida) y lineal para outliers (evita gradientes explosivos)."
      },
      {
        label: "Pérdidas para clasificación: BCE y Cross-Entropy",
        body: "**Binary Cross-Entropy (BCE)**: para $y \\in \\{0,1\\}$ y $\\hat{p} = \\sigma(\\hat{y}) \\in (0,1)$:\n\n$$\\ell_{\\text{BCE}}(\\hat{p}, y) = -y\\log\\hat{p} - (1-y)\\log(1-\\hat{p})$$\n\nDerivado de $y \\sim \\text{Bernoulli}(\\hat{p})$ via $-\\log p(y|\\hat{p})$. El gradiente respecto al logit $z = \\hat{y}$:\n\n$$\\frac{\\partial \\ell}{\\partial z} = \\hat{p} - y$$\n\nnotablemente limpio: el error es simplemente la diferencia entre probabilidad predicha y etiqueta. Esto resulta de la cancelación entre la derivada del log y la derivada del sigmoid.\n\n**Categorical Cross-Entropy (CE)**: para $y \\in \\{1,\\ldots,K\\}$ con softmax $\\hat{\\mathbf{p}} = \\text{softmax}(\\mathbf{z})$:\n\n$$\\ell_{\\text{CE}}(\\hat{\\mathbf{p}}, y) = -\\log \\hat{p}_y = -z_y + \\log\\sum_k e^{z_k}$$\n\nGradiente respecto a logits: $\\partial\\ell/\\partial z_k = \\hat{p}_k - \\mathbb{1}[k=y]$, nuevamente el vector de error entre predicción y one-hot. Este resultado limpio hace que el gradiente de CE+softmax sea numéricamente estable y fácil de implementar."
      },
      {
        label: "Pérdidas especializadas y conexión con divergencias",
        body: "La **Kullback-Leibler divergence** conecta la cross-entropy con la teoría de información:\n\n$$D_{KL}(P \\| Q) = \\sum_k p_k \\log\\frac{p_k}{q_k} = H(P,Q) - H(P)$$\n\nMinimizar $\\ell_{\\text{CE}}(\\hat{\\mathbf{p}}, P) = H(P, \\hat{\\mathbf{p}})$ es equivalente a minimizar $D_{KL}(P \\| \\hat{\\mathbf{p}})$ cuando $P$ es fija (la distribución empírica de los datos).\n\n**Label Smoothing**: reemplaza el one-hot $y$ por $\\tilde{y}_k = (1-\\varepsilon)\\mathbb{1}[k=y] + \\varepsilon/K$, suavizando los objetivos y reduciendo la sobreconfianza:\n\n$$\\ell_{\\text{LS}} = (1-\\varepsilon)\\ell_{\\text{CE}} + \\varepsilon \\cdot H(\\text{Uniform}, \\hat{\\mathbf{p}})$$\n\n**Focal Loss** (para desbalance de clases): $(1-\\hat{p}_y)^\\gamma \\cdot (-\\log\\hat{p}_y)$, que reduce el peso de los ejemplos fáciles (bien clasificados) y enfoca el entrenamiento en los difíciles.\n\n**Contrastive Loss / InfoNCE**: en aprendizaje auto-supervisado (SimCLR, CLIP):\n\n$$\\ell = -\\log\\frac{e^{\\text{sim}(z_i,z_j)/\\tau}}{\\sum_{k\\neq i} e^{\\text{sim}(z_i,z_k)/\\tau}}$$"
      },
      {
        label: "En Machine Learning / Conexión con DL",
        body: "La elección de la función de pérdida tiene implicaciones profundas en el comportamiento del modelo:\n\n**Gradient flow y magnitud**: en entrenamiento profundo, el gradiente de la pérdida es el primer factor en la cadena de backprop. BCE con sigmoid tiene gradiente $\\hat{p}-y \\in [-1,1]$ —bien escalado—. MSE con sigmoid tiene gradiente $2r \\cdot \\sigma'(z) \\in [-0.5, 0.5]$ —más pequeño por la saturación de sigmoid—, lo que hace BCE preferible para clasificación.\n\n**Pérdidas en LLMs**: los modelos de lenguaje minimizan CE sobre el vocabulario ($K \\sim 50000$ tokens). La perplejidad $\\text{PPL} = \\exp(\\mathcal{L}_{\\text{CE}})$ es la métrica estándar: PPL=10 significa que el modelo asigna en media $1/10$ de probabilidad al token correcto.\n\n**RLHF y pérdidas de preferencia**: Bradley-Terry loss para modelar preferencias humanas:\n\n$$\\ell_{\\text{BT}} = -\\log\\sigma(r(x,y_w) - r(x,y_l))$$\n\ndonde $y_w$ es la respuesta preferida y $y_l$ la rechazada. DPO simplifica esto eliminando el modelo de recompensa explícito.\n\n**Numerical stability**: implementar $\\log(\\sigma(z))$ directamente causa underflow para $z \\ll 0$. La forma numéricamente estable es $-\\text{softplus}(-z) = -\\log(1+e^{-z})$. PyTorch's `F.binary_cross_entropy_with_logits` implementa esto automáticamente."
      },
    ],
    code: `# Python - Funciones de pérdida: implementación, gradientes y propiedades
import numpy as np
import torch
import torch.nn.functional as F

# ── 1. Pérdidas de regresión ──────────────────────────────────────────────
def mse(y_hat, y):     return np.mean((y_hat - y)**2)
def mae(y_hat, y):     return np.mean(np.abs(y_hat - y))
def huber(y_hat, y, delta=1.0):
    r = y_hat - y
    return np.mean(np.where(np.abs(r)<=delta, 0.5*r**2, delta*(np.abs(r)-0.5*delta)))

# Gradientes (para implementación manual de backprop)
def grad_mse(y_hat, y, n):   return 2*(y_hat - y)/n
def grad_mae(y_hat, y, n):   return np.sign(y_hat - y)/n
def grad_huber(y_hat, y, delta, n):
    r = y_hat - y
    return np.where(np.abs(r)<=delta, r, delta*np.sign(r))/n

np.random.seed(42)
y_true = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 100.0])  # outlier en 100
y_pred = np.array([1.1, 2.3, 2.8, 4.5, 4.9,  10.0])

print("── Regresión ──")
print(f"MSE:      {mse(y_pred, y_true):.4f}  ← dominado por outlier")
print(f"MAE:      {mae(y_pred, y_true):.4f}  ← más robusto")
print(f"Huber(δ=1): {huber(y_pred, y_true, 1.0):.4f}  ← compromiso")

# ── 2. Pérdidas de clasificación binaria ──────────────────────────────────
def bce_stable(logits, y):
    """BCE numéricamente estable via log-sum-exp."""
    return np.mean(np.maximum(logits, 0) - logits*y + np.log1p(np.exp(-np.abs(logits))))

sigmoid = lambda z: 1/(1+np.exp(-z))

logits = np.array([ 2.5, -1.2,  0.8, -3.1,  1.9])
y_bin  = np.array([   1,    0,    1,    0,    1], dtype=float)
p_hat  = sigmoid(logits)

print("\n── Clasificación binaria ──")
print(f"Logits:  {logits}")
print(f"P(y=1):  {np.round(p_hat, 3)}")
print(f"BCE (estable): {bce_stable(logits, y_bin):.4f}")
# Gradiente = p_hat - y (limpio!)
grad_bce = (p_hat - y_bin) / len(y_bin)
print(f"∂BCE/∂z = p̂−y = {np.round(grad_bce, 4)}")

# ── 3. Cross-Entropy multiclase + softmax ─────────────────────────────────
def softmax(z):
    e = np.exp(z - z.max())
    return e / e.sum()

def ce_loss(logits_matrix, labels):
    """CE multiclase estable: log-sum-exp."""
    n = len(labels)
    losses = []
    for i, (z, y) in enumerate(zip(logits_matrix, labels)):
        log_sum_exp = np.log(np.sum(np.exp(z - z.max()))) + z.max() - z.max()
        # Reescribir: CE = -z_y + log Σ exp(z_k)
        losses.append(-z[y] + np.log(np.sum(np.exp(z - z.max()))) + z.max() - z.max())
    return np.mean(losses)

# Tres clases, cuatro ejemplos
Z = np.array([[2.0, 1.0, 0.1],
              [0.5, 2.5, 0.2],
              [0.1, 0.3, 3.0],
              [1.8, 0.2, 0.5]])
y_cat = np.array([0, 1, 2, 0])

P = np.array([softmax(z) for z in Z])
print(f"\n── CE multiclase ──")
print(f"CE loss: {ce_loss(Z, y_cat):.4f}")
print(f"Perplejidad: {np.exp(ce_loss(Z, y_cat)):.4f}")
# Gradiente = softmax - one_hot
K = 3
one_hot = np.eye(K)[y_cat]
grad_ce = (P - one_hot) / len(y_cat)
print(f"∂CE/∂z (primero):\n  {np.round(grad_ce[0], 4)}")

# ── 4. Verificación con PyTorch ───────────────────────────────────────────
Z_t  = torch.tensor(Z, dtype=torch.float32)
y_t  = torch.tensor(y_cat, dtype=torch.long)

ce_torch = F.cross_entropy(Z_t, y_t)
print(f"\nCE PyTorch:  {ce_torch.item():.4f}  (debe coincidir)")
ppl_torch = torch.exp(ce_torch)
print(f"Perplejidad: {ppl_torch.item():.4f}")

# ── 5. Label Smoothing ────────────────────────────────────────────────────
def label_smoothing_ce(logits, y, K, eps=0.1):
    """CE con label smoothing: mezcla one-hot con uniforme."""
    p_soft = np.zeros(K) + eps/K
    p_soft[y] += 1 - eps
    log_p = logits - np.log(np.sum(np.exp(logits - logits.max()))) - logits.max()
    return -np.sum(p_soft * log_p)

z_ex = np.array([3.0, 0.5, 0.2])
print(f"\n── Label Smoothing ──")
print(f"CE normal:          {label_smoothing_ce(z_ex, 0, 3, eps=0.0):.4f}")
print(f"CE label-smooth 10%:{label_smoothing_ce(z_ex, 0, 3, eps=0.1):.4f}")

# ── 6. Focal Loss ─────────────────────────────────────────────────────────
def focal_loss(p_hat, y, gamma=2.0):
    """Focal loss: (1-p_y)^γ * CE. Enfoca en ejemplos difíciles."""
    p_y   = np.where(y==1, p_hat, 1-p_hat)
    ce    = -np.log(np.clip(p_y, 1e-9, 1))
    return np.mean((1-p_y)**gamma * ce)

p_easy = np.array([0.95, 0.03])   # bien clasificados
p_hard = np.array([0.55, 0.45])   # difíciles
y_fl   = np.array([1, 0])
print(f"\n── Focal Loss (γ=2) ──")
print(f"BCE  (fácil): {bce_stable(np.log(p_easy/(1-p_easy+1e-9)),y_fl):.4f}")
print(f"Focal(fácil): {focal_loss(p_easy, y_fl):.4f}  ← reducido")
print(f"BCE  (difíc): {bce_stable(np.log(p_hard/(1-p_hard+1e-9)),y_fl):.4f}")
print(f"Focal(difíc): {focal_loss(p_hard, y_fl):.4f}  ← similar, enfoca aquí")

# ── 7. Perplexity en LLM ─────────────────────────────────────────────────
# Simular pérdidas por token en una secuencia
token_ce_losses = np.array([2.1, 1.8, 3.5, 0.9, 2.3, 4.1, 1.2])
ppl = np.exp(np.mean(token_ce_losses))
print(f"\n── LLM Perplexity ──")
print(f"CE por token: {np.round(token_ce_losses,2)}")
print(f"PPL = exp(mean CE) = {ppl:.2f}")
print(f"Interpretación: el modelo asigna ≈ 1/{ppl:.0f} de prob. al token correcto en media")
`,
    related: ["Descenso de Gradiente", "Backpropagation", "Regresión Logística", "Entropía y KL Divergence", "Calibración de Modelos", "RLHF y DPO"],
    hasViz: true,
    vizType: "lossLandscape",
  }

];
