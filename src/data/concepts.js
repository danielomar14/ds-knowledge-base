export const concepts = [
  {
    id: 1, section: "Álgebra Lineal", sectionCode: "II",
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
    id: 2, section: "Probabilidad", sectionCode: "IV",
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
    id: 3, section: "Cálculo y Optimización", sectionCode: "III",
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
    id: 4, section: "LLMs Avanzados", sectionCode: "IX",
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
    id: 5, section: "Álgebra Lineal", sectionCode: "II",
    name: "Vector",
    tags: ["vectores", "espacio vectorial"],
    definition: "Elemento de un espacio vectorial. Puede interpretarse como una tupla ordenada de escalares (vista algebraica) o como una magnitud con dirección y sentido (vista geométrica).",
    formal: {
      notation: "Sea $\\mathbb{F}$ un campo (usualmente $\\mathbb{R}$ o $\\mathbb{C}$)",
      body: "\\mathbf{v} = (v_1, v_2, \\ldots, v_n)^\\top \\in \\mathbb{F}^n",
      geometric: "\\mathbf{v} + \\mathbf{w} = (v_1+w_1,\\ldots,v_n+w_n)^\\top,\\quad \\alpha\\mathbf{v} = (\\alpha v_1,\\ldots,\\alpha v_n)^\\top",
      properties: [
        "\\text{Conmutatividad: } \\mathbf{u}+\\mathbf{v} = \\mathbf{v}+\\mathbf{u}",
        "\\text{Elemento neutro: } \\mathbf{v}+\\mathbf{0} = \\mathbf{v}",
        "\\text{Inverso aditivo: } \\mathbf{v}+(-\\mathbf{v}) = \\mathbf{0}",
        "\\text{Distributividad: } \\alpha(\\mathbf{u}+\\mathbf{v}) = \\alpha\\mathbf{u}+\\alpha\\mathbf{v}",
      ],
    },
    intuition: "Un vector es una flecha en el espacio: saber dónde apunta y qué tan larga es lo determina completamente. En ML, un vector de features describe un punto de dato en un espacio de alta dimensión.",
    development: [
      { label: "Representaciones", body: "Columna (estándar): $\\mathbf{v} \\in \\mathbb{R}^{n\\times 1}$. Fila: $\\mathbf{v}^\\top \\in \\mathbb{R}^{1\\times n}$.\n\nEn NumPy, un vector 1D `np.array([1,2,3])` no tiene orientación — importa cuando se multiplica con matrices." },
      { label: "Normas de vectores", body: "Norma $L_p$: $\\|\\mathbf{v}\\|_p = \\left(\\sum_i |v_i|^p\\right)^{1/p}$\n\n$L_1$: $\\sum|v_i|$ — robusta a outliers, induce sparsity.\n$L_2$: $\\sqrt{\\sum v_i^2}$ — la norma euclídea usual.\n$L_\\infty$: $\\max_i |v_i|$ — el componente de mayor magnitud." },
      { label: "En ML", body: "Cada muestra de datos es un vector $\\mathbf{x} \\in \\mathbb{R}^d$. Los parámetros de un modelo lineal son un vector $\\mathbf{w} \\in \\mathbb{R}^d$. Los embeddings de palabras son vectores en $\\mathbb{R}^{300}$ o $\\mathbb{R}^{768}$." },
    ],
    code: `import numpy as np

v = np.array([3.0, -1.0, 2.0])

# Normas
l1  = np.linalg.norm(v, ord=1)   # 6.0
l2  = np.linalg.norm(v)           # 3.742
linf= np.linalg.norm(v, ord=np.inf)  # 3.0

# Operaciones básicas
w = np.array([1.0, 2.0, -1.0])
suma   = v + w
escala = 2.5 * v
print(f"L1={l1:.2f}, L2={l2:.3f}, Linf={linf}")`,
    related: ["Espacio vectorial", "Norma L1/L2", "Producto punto", "Embedding"],
    hasViz: false,
  },
  {
    id: 6, section: "Álgebra Lineal", sectionCode: "II",
    name: "Espacio y Subespacio Vectorial",
    tags: ["álgebra", "estructura"],
    definition: "Un espacio vectorial es un conjunto V sobre un campo F cerrado bajo suma y multiplicación escalar que satisface 8 axiomas. Un subespacio es un subconjunto no vacío de V que es él mismo un espacio vectorial.",
    formal: {
      notation: "Sea $V$ un espacio vectorial sobre $\\mathbb{F}$ y $W \\subseteq V$",
      body: "W \\text{ es subespacio} \\iff \\begin{cases} \\mathbf{0} \\in W \\\\ \\mathbf{u},\\mathbf{v} \\in W \\Rightarrow \\mathbf{u}+\\mathbf{v} \\in W \\\\ \\alpha \\in \\mathbb{F},\\, \\mathbf{v} \\in W \\Rightarrow \\alpha\\mathbf{v} \\in W \\end{cases}",
      geometric: "W_1 \\cap W_2 \\text{ es subespacio}; \\quad W_1 \\cup W_2 \\text{ es subespacio} \\iff W_1 \\subseteq W_2 \\text{ o } W_2 \\subseteq W_1",
      properties: [
        "\\{\\mathbf{0}\\} \\text{ y } V \\text{ son siempre subespacios (triviales)}",
        "\\dim(W_1 + W_2) = \\dim W_1 + \\dim W_2 - \\dim(W_1 \\cap W_2)",
        "\\text{Núcleo (kernel) de } A: \\ker(A) = \\{\\mathbf{x}: A\\mathbf{x}=\\mathbf{0}\\} \\text{ es subespacio}",
      ],
    },
    intuition: "Un subespacio es como un plano o recta que pasa por el origen: puedes moverte dentro de él libremente (suma y escala) sin salir. El origen siempre está incluido — si no, no es subespacio.",
    development: [
      { label: "Los 8 axiomas de espacio vectorial", body: "Conmutatividad, asociatividad de suma, elemento neutro ($\\mathbf{0}$), inverso aditivo, compatibilidad escalar, distributividad escalar sobre vectores, distributividad escalar sobre escalares, neutro multiplicativo ($1\\cdot\\mathbf{v}=\\mathbf{v}$)." },
      { label: "Ejemplos clave", body: "$\\mathbb{R}^n$, $\\mathbb{C}^n$: los más usados en ML.\n$\\mathcal{M}_{m\\times n}(\\mathbb{R})$: matrices, espacio vectorial de dimensión $mn$.\n$\\mathcal{P}_n$: polinomios de grado $\\leq n$, dimensión $n+1$.\n$\\ker(A)$: kernel de una matriz, crucial en análisis de sistemas lineales." },
      { label: "Relevancia en ML", body: "El espacio de columnas (column space) de una matriz $A \\in \\mathbb{R}^{m\\times n}$ es el subespacio de $\\mathbb{R}^m$ alcanzable: $\\text{col}(A) = \\{A\\mathbf{x}: \\mathbf{x}\\in\\mathbb{R}^n\\}$. En regresión, si $\\mathbf{y} \\notin \\text{col}(X)$, no hay solución exacta — usamos mínimos cuadrados." },
    ],
    code: `import numpy as np

# Verificar si un conjunto de vectores forma subespacio
def es_subespacio_candidato(vecs):
    """Verifica condiciones necesarias (no suficientes)."""
    # 1. Contiene el cero
    tiene_cero = any(np.allclose(v, 0) for v in vecs)
    # 2. Closed under addition (muestreo)
    for i in range(len(vecs)):
        for j in range(i, len(vecs)):
            suma = vecs[i] + vecs[j]
            # En práctica: verificar que suma esté en el span
    return tiene_cero

# Column space de una matriz
A = np.array([[1,2],[3,4],[5,6]])
# Rango = dimensión del column space
print(f"dim(col(A)) = {np.linalg.matrix_rank(A)}")  # 2

# Kernel: Ax=0
# Para sistemas sobredeterminados, usar SVD`,
    related: ["Vector", "Base y dimensión", "Combinación lineal", "Kernel"],
    hasViz: false,
  },
  {
    id: 7, section: "Álgebra Lineal", sectionCode: "II",
    name: "Combinación Lineal y Span",
    tags: ["álgebra", "bases"],
    definition: "Una combinación lineal de vectores es su suma ponderada por escalares. El span (espacio generado) es el conjunto de todas las combinaciones lineales posibles de un conjunto de vectores.",
    formal: {
      notation: "Dados $\\mathbf{v}_1, \\ldots, \\mathbf{v}_k \\in V$ y escalares $\\alpha_1, \\ldots, \\alpha_k \\in \\mathbb{F}$",
      body: "\\mathbf{w} = \\sum_{i=1}^k \\alpha_i \\mathbf{v}_i = \\alpha_1\\mathbf{v}_1 + \\alpha_2\\mathbf{v}_2 + \\cdots + \\alpha_k\\mathbf{v}_k",
      geometric: "\\text{span}\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\} = \\left\\{\\sum_{i=1}^k \\alpha_i\\mathbf{v}_i \\;:\\; \\alpha_i \\in \\mathbb{F}\\right\\}",
      properties: [
        "\\text{span}\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\} \\text{ siempre es un subespacio}",
        "\\text{span}\\{\\mathbf{v}\\} = \\{\\alpha\\mathbf{v}: \\alpha\\in\\mathbb{F}\\} \\text{ (recta por el origen)}",
        "\\text{span}(S) = \\text{el menor subespacio que contiene a } S",
      ],
    },
    intuition: "Si tienes dos vectores no paralelos en $\\mathbb{R}^2$, su span cubre todo el plano. Si son paralelos, su span es solo una recta. El span responde: ¿qué puntos del espacio puedo alcanzar con estas 'palancas'?",
    development: [
      { label: "Span en dimensiones", body: "Un vector en $\\mathbb{R}^2$: span es una recta (dim 1).\nDos vectores LI en $\\mathbb{R}^2$: span = $\\mathbb{R}^2$ (dim 2).\nTres vectores en $\\mathbb{R}^2$: span $\\leq \\mathbb{R}^2$ (el tercero es redundante).\n\nLa dimensión del span = rango del conjunto." },
      { label: "Verificar si v está en el span", body: "¿Está $\\mathbf{b}$ en $\\text{span}\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\}$?\nEquivale a resolver $A\\boldsymbol{\\alpha} = \\mathbf{b}$ donde $A = [\\mathbf{v}_1|\\cdots|\\mathbf{v}_k]$.\nSi el sistema es consistente → sí. Si no → no." },
      { label: "En ML", body: "PCA busca una base de vectores cuyo span capture la mayor varianza de los datos. Los embeddings de palabras: 'rey' - 'hombre' + 'mujer' ≈ 'reina' — operaciones de combinación lineal en el espacio latente tienen significado semántico." },
    ],
    code: `import numpy as np

v1 = np.array([1, 0])
v2 = np.array([0, 1])
b  = np.array([3, -2])

# ¿Está b en span{v1, v2}?
A = np.column_stack([v1, v2])
try:
    alphas, res, rank, sv = np.linalg.lstsq(A, b, rcond=None)
    print(f"b = {alphas[0]:.1f}*v1 + {alphas[1]:.1f}*v2")
    print(f"Residual: {res}")  # ~0 si está en el span
except:
    print("No solución")

# Span de vectores dependientes
v3 = 2*v1  # paralelo a v1
A2 = np.column_stack([v1, v3])
print(f"Rank(A2) = {np.linalg.matrix_rank(A2)}")  # 1`,
    related: ["Independencia lineal", "Base y dimensión", "Espacio vectorial", "PCA"],
    hasViz: false,
  },
  {
    id: 8, section: "Álgebra Lineal", sectionCode: "II",
    name: "Independencia Lineal",
    tags: ["álgebra", "bases"],
    definition: "Un conjunto de vectores es linealmente independiente (LI) si ninguno puede expresarse como combinación lineal de los demás. Formalmente, la única combinación lineal que da el vector cero es la trivial.",
    formal: {
      notation: "Vectores $\\mathbf{v}_1, \\ldots, \\mathbf{v}_k \\in V$",
      body: "\\text{LI} \\iff \\sum_{i=1}^k \\alpha_i \\mathbf{v}_i = \\mathbf{0} \\implies \\alpha_1 = \\alpha_2 = \\cdots = \\alpha_k = 0",
      geometric: "\\text{LD (dependientes)} \\iff \\exists\\, j: \\mathbf{v}_j = \\sum_{i \\neq j} \\beta_i \\mathbf{v}_i",
      properties: [
        "k > n \\Rightarrow \\text{cualquier conjunto de } k \\text{ vectores en } \\mathbb{R}^n \\text{ es LD}",
        "\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\} \\text{ LI} \\iff \\text{rank}([\\mathbf{v}_1|\\cdots|\\mathbf{v}_k]) = k",
        "\\text{Si } \\mathbf{0} \\in S \\Rightarrow S \\text{ es LD}",
      ],
    },
    intuition: "Vectores LI son como ejes de coordenadas: cada uno aporta información nueva que los demás no pueden reproducir. Vectores LD son redundantes — hay información duplicada, y puedes eliminar uno sin perder cobertura del espacio.",
    development: [
      { label: "Test algebraico", body: "Formas la matriz $A = [\\mathbf{v}_1|\\cdots|\\mathbf{v}_k]$ y calculas $\\text{rank}(A)$:\n— Si $\\text{rank}(A) = k$: LI.\n— Si $\\text{rank}(A) < k$: LD, y el kernel de $A$ revela las combinaciones nulas." },
      { label: "Determinante (caso cuadrado)", body: "Para $k = n$ vectores en $\\mathbb{R}^n$: $$\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_n\\} \\text{ LI} \\iff \\det([\\mathbf{v}_1|\\cdots|\\mathbf{v}_n]) \\neq 0$$ El determinante mide el volumen del paralelepípedo formado — cero significa colapso dimensional." },
      { label: "En ML y compresión", body: "Features redundantes (LD o correlacionadas) no añaden información al modelo pero aumentan varianza y el riesgo de multicolinealidad en regresión. PCA transforma features correlacionadas en componentes LI (ortogonales), eliminando redundancia." },
    ],
    code: `import numpy as np

# Test de independencia lineal via rango
v1 = np.array([1, 2, 3])
v2 = np.array([4, 5, 6])
v3 = np.array([7, 8, 9])  # v3 = 2*v2 - v1 (LD)

A = np.column_stack([v1, v2, v3])
rank = np.linalg.matrix_rank(A)
print(f"Rank = {rank}")  # 2 → LD

# Encontrar la combinación nula (kernel)
U, S, Vt = np.linalg.svd(A)
# Vectores del kernel corresponden a valores singulares ≈ 0
kernel = Vt[rank:].T
print(f"Kernel: {kernel}")  # combinación que da 0`,
    related: ["Combinación lineal", "Base y dimensión", "Determinante", "SVD"],
    hasViz: false,
  },
  {
    id: 9, section: "Álgebra Lineal", sectionCode: "II",
    name: "Base y Dimensión",
    tags: ["álgebra", "espacio vectorial"],
    definition: "Una base de V es un conjunto de vectores linealmente independientes que generan V (span = V). La dimensión de V es el número de vectores en cualquier base — es invariante.",
    formal: {
      notation: "Sea $V$ espacio vectorial sobre $\\mathbb{F}$",
      body: "B = \\{\\mathbf{b}_1,\\ldots,\\mathbf{b}_n\\} \\text{ es base} \\iff \\begin{cases} B \\text{ es LI} \\\\ \\text{span}(B) = V \\end{cases}",
      geometric: "\\forall\\, \\mathbf{v} \\in V,\\; \\exists!\\;(\\alpha_1,\\ldots,\\alpha_n): \\mathbf{v} = \\sum_{i=1}^n \\alpha_i \\mathbf{b}_i \\quad \\text{(representación única)}",
      properties: [
        "\\dim(\\mathbb{R}^n) = n,\\quad \\dim(\\mathcal{M}_{m\\times n}) = mn",
        "\\text{Toda base de } V \\text{ tiene el mismo número de elementos}",
        "\\dim(\\text{col}(A)) + \\dim(\\ker(A)) = n \\quad \\text{(Teorema rango-nulidad)}",
      ],
    },
    intuition: "La base es el 'sistema de coordenadas' mínimo para describir el espacio. Con $n$ vectores base, cualquier punto se describe de forma única con $n$ coordenadas. Cambiar de base es como cambiar de idioma — el objeto es el mismo, las palabras cambian.",
    development: [
      { label: "Bases canónicas y alternativas", body: "Base canónica de $\\mathbb{R}^n$: $\\{\\mathbf{e}_1,\\ldots,\\mathbf{e}_n\\}$ con $\\mathbf{e}_i = (0,\\ldots,1,\\ldots,0)^\\top$.\n\nBase ortogonal: vectores mutuamente perpendiculares.\nBase ortonormal: ortogonal + unitaria ($\\|\\mathbf{b}_i\\|=1$). Facilita cálculos enormemente." },
      { label: "Teorema rango-nulidad", body: "Para $A \\in \\mathbb{R}^{m\\times n}$: $$\\text{rank}(A) + \\text{nullity}(A) = n$$ donde $\\text{nullity}(A) = \\dim(\\ker(A))$. Esto cuantifica la 'información perdida' por la transformación lineal $A$." },
      { label: "Cambio de base", body: "Si $B = [\\mathbf{b}_1|\\cdots|\\mathbf{b}_n]$ es una base, las coordenadas de $\\mathbf{v}$ en $B$ son: $$[\\mathbf{v}]_B = B^{-1}\\mathbf{v}$$ Fundamental en PCA: los eigenvectores forman la nueva base donde los datos se expresan de forma más compacta." },
    ],
    code: `import numpy as np

# Base canónica de R^3
e1, e2, e3 = np.eye(3)

# Base ortogonal alternativa (Gram-Schmidt)
def gram_schmidt(vecs):
    basis = []
    for v in vecs:
        w = v.copy().astype(float)
        for b in basis:
            w -= np.dot(w, b) * b
        if np.linalg.norm(w) > 1e-10:
            basis.append(w / np.linalg.norm(w))
    return np.array(basis)

V = np.array([[1,1,0],[1,0,1],[0,1,1]], dtype=float)
B = gram_schmidt(V)
print("Base ortonormal:")
print(B)
print(f"dim = {len(B)}")

# Coordenadas en nueva base
v = np.array([2, 3, 1], dtype=float)
coords = B @ v  # proyecciones
print(f"Coordenadas en B: {coords}")`,
    related: ["Independencia lineal", "Cambio de base", "PCA", "Gram-Schmidt"],
    hasViz: false,
  },
  {
    id: 10, section: "Álgebra Lineal", sectionCode: "II",
    name: "Norma de un Vector (L1, L2, Max)",
    tags: ["vectores", "métricas"],
    definition: "Función que asigna a cada vector una longitud no negativa, satisfaciendo positividad, homogeneidad y desigualdad triangular. La familia $L_p$ generaliza distintas nociones de 'tamaño'.",
    formal: {
      notation: "Sea $\\mathbf{v} \\in \\mathbb{R}^n$, $p \\geq 1$",
      body: "\\|\\mathbf{v}\\|_p = \\left(\\sum_{i=1}^n |v_i|^p\\right)^{1/p}",
      geometric: "\\|\\mathbf{v}\\|_\\infty = \\lim_{p\\to\\infty}\\|\\mathbf{v}\\|_p = \\max_{i}|v_i|",
      properties: [
        "\\text{Positividad: } \\|\\mathbf{v}\\|_p \\geq 0,\\ \\|\\mathbf{v}\\|_p = 0 \\iff \\mathbf{v}=\\mathbf{0}",
        "\\text{Homogeneidad: } \\|\\alpha\\mathbf{v}\\|_p = |\\alpha|\\|\\mathbf{v}\\|_p",
        "\\text{Desig. triangular: } \\|\\mathbf{u}+\\mathbf{v}\\|_p \\leq \\|\\mathbf{u}\\|_p + \\|\\mathbf{v}\\|_p",
        "\\|\\mathbf{v}\\|_\\infty \\leq \\|\\mathbf{v}\\|_2 \\leq \\|\\mathbf{v}\\|_1 \\leq \\sqrt{n}\\|\\mathbf{v}\\|_2",
      ],
    },
    intuition: "$L_1$ = distancia de taxi en ciudad con cuadras (solo horizontal/vertical). $L_2$ = distancia en línea recta (vuelo de pájaro). $L_\\infty$ = el movimiento más grande en cualquier dirección. Cada norma define una 'bola unitaria' de forma diferente.",
    development: [
      { label: "Geometría de las bolas unitarias", body: "$L_1$: bola = rombo (diamante) en $\\mathbb{R}^2$, favorece vectores sparse.\n$L_2$: bola = círculo/esfera, isótropa.\n$L_\\infty$: bola = cuadrado/hipercubo.\n\nEsta geometría explica por qué regularización $L_1$ (Lasso) produce soluciones sparse y $L_2$ (Ridge) no." },
      { label: "Regularización y normas", body: "En optimización: $$\\min_\\mathbf{w} \\mathcal{L}(\\mathbf{w}) + \\lambda\\|\\mathbf{w}\\|_p$$\n— $p=1$ (Lasso): solución sparse, selección automática de features.\n— $p=2$ (Ridge): shrinkage uniforme, estable con multicolinealidad.\n— $p=0$ (pseudonorma): NP-hard, cuenta entradas no nulas." },
      { label: "Equivalencia de normas", body: "En $\\mathbb{R}^n$ finito-dimensional, todas las normas son equivalentes (definen la misma topología). Existen constantes $c_1, c_2 > 0$: $$c_1\\|\\mathbf{v}\\|_p \\leq \\|\\mathbf{v}\\|_q \\leq c_2\\|\\mathbf{v}\\|_p$$ Pero las constantes dependen de $n$ — en dimensión alta importa cuál usas." },
    ],
    code: `import numpy as np

v = np.array([3.0, -4.0, 0.0, 1.0])

norms = {
    "L1": np.linalg.norm(v, ord=1),       # 8.0
    "L2": np.linalg.norm(v, ord=2),       # 5.099
    "Linf": np.linalg.norm(v, ord=np.inf),# 4.0
    "L0": np.sum(v != 0),                  # 3 (pseudonorma)
}
for name, val in norms.items():
    print(f"{name}: {val:.3f}")

# Normalizar a L2 unitario
v_unit = v / np.linalg.norm(v)
print(f"||v_unit||_2 = {np.linalg.norm(v_unit):.6f}")  # 1.0`,
    related: ["Vector", "Distancia euclídea", "Regularización L1/L2", "Similitud coseno"],
    hasViz: false,
  },
  {
    id: 11, section: "Álgebra Lineal", sectionCode: "II",
    name: "Similitud Coseno",
    tags: ["vectores", "métricas", "NLP"],
    definition: "Medida de similitud entre dos vectores definida como el coseno del ángulo entre ellos. Invariante a la magnitud — mide orientación, no longitud. Ampliamente usada en NLP y sistemas de recomendación.",
    formal: {
      notation: "Sean $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n \\setminus \\{\\mathbf{0}\\}$",
      body: "\\text{cos\\_sim}(\\mathbf{u},\\mathbf{v}) = \\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\|\\mathbf{u}\\|_2\\,\\|\\mathbf{v}\\|_2} = \\cos\\theta \\in [-1, 1]",
      geometric: "\\text{dist\\_coseno}(\\mathbf{u},\\mathbf{v}) = 1 - \\text{cos\\_sim}(\\mathbf{u},\\mathbf{v}) \\in [0, 2]",
      properties: [
        "\\text{cos\\_sim} = 1 \\iff \\mathbf{u} \\parallel \\mathbf{v} \\text{ (misma dirección)}",
        "\\text{cos\\_sim} = 0 \\iff \\mathbf{u} \\perp \\mathbf{v} \\text{ (ortogonales)}",
        "\\text{cos\\_sim} = -1 \\iff \\mathbf{u} \\parallel -\\mathbf{v} \\text{ (opuestos)}",
        "\\text{No es una métrica: no satisface desigualdad triangular en forma general}",
      ],
    },
    intuition: "Dos documentos pueden tener distinta longitud pero el mismo tema. La similitud coseno los detecta como similares porque sus vectores de palabras apuntan en la misma dirección, aunque uno sea más largo. Es como comparar la dirección de dos flechas, sin importar su longitud.",
    development: [
      { label: "En NLP y embeddings", body: "Dados embeddings $\\mathbf{e}_{\\text{rey}}, \\mathbf{e}_{\\text{reina}} \\in \\mathbb{R}^{300}$, su similitud coseno es alta (≈0.8). En búsqueda semántica: dada una query $\\mathbf{q}$, se rankean documentos por $\\text{cos\\_sim}(\\mathbf{q}, \\mathbf{d}_i)$." },
      { label: "Relación con producto punto normalizado", body: "Si $\\|\\mathbf{u}\\|=\\|\\mathbf{v}\\|=1$ (vectores unitarios): $$\\text{cos\\_sim}(\\mathbf{u},\\mathbf{v}) = \\mathbf{u}\\cdot\\mathbf{v}$$ Por eso en transformers se normalizan los embeddings antes de calcular attention — el scaled dot-product $\\frac{QK^\\top}{\\sqrt{d_k}}$ es similitud coseno escalada." },
      { label: "Cuándo NO usar coseno", body: "Si la magnitud importa (e.g., frecuencia de ocurrencia), coseno pierde información. Alternativas: distancia euclídea, distancia de Mahalanobis (considera correlaciones), o KL divergence si son distribuciones." },
    ],
    code: `import numpy as np

def cosine_similarity(u, v):
    return np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))

# Ejemplo: documentos como bag-of-words
# Vocabulario: [ML, python, receta, cocina]
doc1 = np.array([3, 2, 0, 0])  # sobre ML
doc2 = np.array([2, 1, 0, 0])  # sobre ML (más corto)
doc3 = np.array([0, 0, 2, 3])  # sobre cocina

print(cosine_similarity(doc1, doc2))  # ≈ 1.0 (mismo tema)
print(cosine_similarity(doc1, doc3))  # ≈ 0.0 (temas distintos)

# Con sklearn
from sklearn.metrics.pairwise import cosine_similarity as cs
M = np.vstack([doc1, doc2, doc3])
print(cs(M))  # matriz de similitudes`,
    related: ["Producto punto", "Norma L2", "Embeddings", "Distancia euclídea"],
    hasViz: false,
  },
  {
    id: 12, section: "Álgebra Lineal", sectionCode: "II",
    name: "Ortogonalidad y Proyección Vectorial",
    tags: ["geometría", "álgebra"],
    definition: "Dos vectores son ortogonales si su producto punto es cero. La proyección ortogonal descompone un vector en componentes paralela y perpendicular a un subespacio dado — es la aproximación más cercana dentro del subespacio.",
    formal: {
      notation: "Sea $W \\subseteq \\mathbb{R}^n$ subespacio con base ortonormal $\\{\\mathbf{q}_1,\\ldots,\\mathbf{q}_k\\}$",
      body: "\\text{proj}_W(\\mathbf{v}) = \\sum_{i=1}^k (\\mathbf{q}_i^\\top \\mathbf{v})\\,\\mathbf{q}_i = QQ^\\top\\mathbf{v}",
      geometric: "\\mathbf{v} = \\underbrace{\\text{proj}_W(\\mathbf{v})}_{\\in W} + \\underbrace{(\\mathbf{v} - \\text{proj}_W(\\mathbf{v}))}_{\\in W^\\perp}",
      properties: [
        "\\|\\mathbf{v} - \\text{proj}_W(\\mathbf{v})\\| \\leq \\|\\mathbf{v} - \\mathbf{w}\\|\\; \\forall \\mathbf{w}\\in W \\text{ (mejor aprox.)}",
        "\\text{proj}_W \\circ \\text{proj}_W = \\text{proj}_W \\text{ (idempotente)}",
        "QQ^\\top \\text{ es la matriz de proyección sobre col}(Q)",
      ],
    },
    intuition: "Proyectar es como encontrar tu 'sombra' sobre un plano cuando el sol cae perpendicular a él. La sombra es el punto del plano más cercano a ti. En mínimos cuadrados, proyectamos $\\mathbf{b}$ sobre el espacio columna de $A$ para encontrar la mejor solución aproximada.",
    development: [
      { label: "Mínimos cuadrados via proyección", body: "Sistema sobredeterminado $A\\mathbf{x}=\\mathbf{b}$ con $\\mathbf{b}\\notin\\text{col}(A)$. La solución de mínimos cuadrados proyecta $\\mathbf{b}$ sobre $\\text{col}(A)$: $$\\hat{\\mathbf{x}} = (A^\\top A)^{-1}A^\\top\\mathbf{b}$$ y $\\hat{\\mathbf{b}} = A\\hat{\\mathbf{x}} = A(A^\\top A)^{-1}A^\\top\\mathbf{b}$ es la proyección." },
      { label: "Complemento ortogonal", body: "$W^\\perp = \\{\\mathbf{v}: \\mathbf{v}\\cdot\\mathbf{w}=0 \\;\\forall \\mathbf{w}\\in W\\}$\n\n$\\mathbb{R}^n = W \\oplus W^\\perp$ (descomposición directa ortogonal).\n$\\dim(W) + \\dim(W^\\perp) = n$.\n\nEl error residual en mínimos cuadrados $\\mathbf{r} = \\mathbf{b} - A\\hat{\\mathbf{x}}$ pertenece a $\\text{col}(A)^\\perp = \\ker(A^\\top)$." },
      { label: "Proceso de Gram-Schmidt", body: "Ortogonalización de $\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\}$: $$\\mathbf{u}_j = \\mathbf{v}_j - \\sum_{i<j}\\frac{\\mathbf{u}_i^\\top\\mathbf{v}_j}{\\mathbf{u}_i^\\top\\mathbf{u}_i}\\mathbf{u}_i$$ Produce base ortogonal; dividir por normas da base ortonormal. Base de la factorización QR." },
    ],
    code: `import numpy as np

# Proyección sobre subespacio
def proyectar(v, Q):
    """Q: columnas = base ortonormal del subespacio."""
    return Q @ Q.T @ v

# Ejemplo: proyección sobre el plano x+y+z=0
# Base ortonormal del plano
n = np.array([1,1,1]) / np.sqrt(3)  # normal al plano
# Proyección sobre el complemento ortogonal de n
def proj_sobre_plano(v, normal):
    return v - np.dot(v, normal) * normal

v = np.array([2.0, 1.0, 3.0])
proj = proj_sobre_plano(v, n)
print(f"Proyección: {proj}")
print(f"Error (debe ser ortogonal): {np.dot(proj, n):.2e}")

# Mínimos cuadrados
A = np.array([[1,1],[1,2],[1,3]])
b = np.array([1.0, 2.0, 2.0])
x_hat = np.linalg.lstsq(A, b, rcond=None)[0]
print(f"Solución LS: {x_hat}")`,
    related: ["Producto punto", "Mínimos cuadrados", "Gram-Schmidt", "QR"],
    hasViz: false,
  },
  {
    id: 13, section: "Álgebra Lineal", sectionCode: "II",
    name: "Matriz y Tipos",
    tags: ["matrices", "álgebra lineal"],
    definition: "Arreglo rectangular de escalares de $m$ filas y $n$ columnas. Representa transformaciones lineales entre espacios vectoriales. Los tipos especiales tienen propiedades algebraicas y computacionales importantes.",
    formal: {
      notation: "Sea $A \\in \\mathbb{F}^{m\\times n}$, $A_{ij}$ el elemento en fila $i$, columna $j$",
      body: "A = \\begin{pmatrix} a_{11} & \\cdots & a_{1n} \\\\ \\vdots & \\ddots & \\vdots \\\\ a_{m1} & \\cdots & a_{mn} \\end{pmatrix}",
      geometric: "(AB)_{ij} = \\sum_{k=1}^p A_{ik}B_{kj} \\quad \\text{para } A\\in\\mathbb{R}^{m\\times p},\\, B\\in\\mathbb{R}^{p\\times n}",
      properties: [
        "\\text{Identidad: } I_n,\\; I_n A = A I_m = A",
        "\\text{Simétrica: } A = A^\\top,\\; a_{ij} = a_{ji}",
        "\\text{Ortogonal: } Q^\\top Q = QQ^\\top = I,\\; Q^{-1} = Q^\\top",
        "\\text{Definida positiva: } \\mathbf{x}^\\top A\\mathbf{x} > 0 \\;\\forall \\mathbf{x}\\neq\\mathbf{0}",
      ],
    },
    intuition: "Una matriz es una transformación lineal empaquetada: puede rotar, escalar, reflejar o comprimir el espacio. La identidad no hace nada. Las matrices ortogonales preservan longitudes y ángulos (rotaciones/reflexiones puras).",
    development: [
      { label: "Tipos fundamentales", body: "Diagonal $D$: $d_{ij}=0$ si $i\\neq j$ — escala cada eje independientemente.\nTriangular superior/inferior: solución por sustitución hacia atrás/adelante.\nSPD (simétrica definida positiva): aparece en covarianzas, Hessiana de funciones convexas, kernels.\nEsparsa: mayoría de entradas son cero — grafos, redes, NLP." },
      { label: "Rango de una matriz", body: "$\\text{rank}(A) = \\dim(\\text{col}(A)) = \\dim(\\text{row}(A))$.\nRango máximo: $\\min(m,n)$. Rango deficiente $\\Rightarrow$ sistema singular.\n\n$\\text{rank}(AB) \\leq \\min(\\text{rank}(A), \\text{rank}(B))$\n$\\text{rank}(A + B) \\leq \\text{rank}(A) + \\text{rank}(B)$" },
      { label: "Matrices en Deep Learning", body: "Pesos de una capa: $W \\in \\mathbb{R}^{d_{out}\\times d_{in}}$.\nAtención: $Q,K,V \\in \\mathbb{R}^{n\\times d_k}$.\nGram matrix: $G = X^\\top X \\in \\mathbb{R}^{d\\times d}$ — aparece en kernel methods y style transfer.\nBatch de datos: $X \\in \\mathbb{R}^{B\\times d}$ donde $B$ es el batch size." },
    ],
    code: `import numpy as np

# Tipos de matrices
n = 4
I   = np.eye(n)                           # Identidad
D   = np.diag([1, 2, 3, 4])              # Diagonal
S   = np.array([[2,1],[1,3]])             # Simétrica SPD
Q, _ = np.linalg.qr(np.random.randn(3,3))# Ortogonal

# Verificaciones
print("Simétrica:", np.allclose(S, S.T))
print("Q ortogonal:", np.allclose(Q.T @ Q, np.eye(3)))
print("SPD (eigvals > 0):", np.all(np.linalg.eigvalsh(S) > 0))

# Operaciones
A = np.random.randn(3, 4)
B = np.random.randn(4, 2)
C = A @ B                    # (3,4)@(4,2) = (3,2)
print(f"rank(A) = {np.linalg.matrix_rank(A)}")`,
    related: ["Determinante", "Inversa de matriz", "Eigenvalores", "SVD"],
    hasViz: false,
  },
  {
    id: 14, section: "Álgebra Lineal", sectionCode: "II",
    name: "Determinante y Rango",
    tags: ["matrices", "álgebra"],
    definition: "El determinante es un escalar asociado a una matriz cuadrada que mide el factor de cambio de volumen de la transformación lineal. El rango es la dimensión del espacio columna — cuántas dimensiones 'realmente' usa la transformación.",
    formal: {
      notation: "Sea $A \\in \\mathbb{R}^{n\\times n}$",
      body: "\\det(A) = \\sum_{\\sigma \\in S_n} \\text{sgn}(\\sigma) \\prod_{i=1}^n a_{i,\\sigma(i)}",
      geometric: "|\\det(A)| = \\text{volumen del paralelepípedo formado por las columnas de } A",
      properties: [
        "\\det(AB) = \\det(A)\\det(B)",
        "\\det(A^\\top) = \\det(A)",
        "\\det(A^{-1}) = 1/\\det(A)",
        "A \\text{ invertible} \\iff \\det(A) \\neq 0 \\iff \\text{rank}(A) = n",
      ],
    },
    intuition: "El determinante dice si la transformación aplasta el espacio (det=0: colapso a dimensión menor), lo refleja (det<0: inversión de orientación), o cuánto lo expande/contrae (|det|). Rank=1 significa toda la imagen cae en una recta.",
    development: [
      { label: "Cálculo eficiente", body: "Expansión por cofactores: $O(n!)$ — impracticable para $n>5$.\nEliminación gaussiana (LU): $O(n^3)$ — método estándar.\n\nPara matrices grandes en ML: raro calcular det directamente. Se usa $\\log|\\det(A)|$ para estabilidad numérica (e.g., en densidades gaussianas multivariadas)." },
      { label: "Rango y sistemas lineales", body: "Sistema $A\\mathbf{x}=\\mathbf{b}$:\n— $\\text{rank}(A) = \\text{rank}([A|\\mathbf{b}]) = n$: solución única.\n— $\\text{rank}(A) = \\text{rank}([A|\\mathbf{b}]) < n$: infinitas soluciones.\n— $\\text{rank}(A) < \\text{rank}([A|\\mathbf{b}])$: sin solución." },
      { label: "Log-determinante en probabilidad", body: "La densidad gaussiana multivariada: $$\\mathcal{N}(\\mathbf{x};\\boldsymbol{\\mu},\\Sigma) = \\frac{1}{(2\\pi)^{n/2}|\\det\\Sigma|^{1/2}}\\exp\\!\\left(-\\frac{1}{2}(\\mathbf{x}-\\boldsymbol{\\mu})^\\top\\Sigma^{-1}(\\mathbf{x}-\\boldsymbol{\\mu})\\right)$$ requiere $\\log\\det\\Sigma$ — calculado via Cholesky: $\\log\\det\\Sigma = 2\\sum_i \\log L_{ii}$." },
    ],
    code: `import numpy as np

A = np.array([[2,1,0],[1,3,1],[0,1,4]], dtype=float)

# Determinante
det_A = np.linalg.det(A)
print(f"det(A) = {det_A:.4f}")

# Log-determinante (estable numéricamente)
sign, logdet = np.linalg.slogdet(A)
print(f"log|det(A)| = {logdet:.4f}")

# Rango
rank = np.linalg.matrix_rank(A)
print(f"rank(A) = {rank}")

# Determinante via LU
from scipy.linalg import lu
P, L, U = lu(A)
det_via_lu = np.prod(np.diag(U)) * np.linalg.det(P)
print(f"det via LU = {det_via_lu:.4f}")`,
    related: ["Inversa de matriz", "Sistemas lineales", "Eigenvalores", "Factorización LU"],
    hasViz: false,
  },
  {
    id: 15, section: "Álgebra Lineal", sectionCode: "II",
    name: "Inversa y Pseudoinversa (Moore-Penrose)",
    tags: ["matrices", "álgebra"],
    definition: "La inversa $A^{-1}$ existe solo para matrices cuadradas no singulares. La pseudoinversa de Moore-Penrose $A^+$ generaliza la inversa a matrices rectangulares y singulares — siempre existe.",
    formal: {
      notation: "Sea $A \\in \\mathbb{R}^{m\\times n}$ con SVD: $A = U\\Sigma V^\\top$",
      body: "A^+ = V\\Sigma^+ U^\\top, \\quad \\Sigma^+_{ii} = \\begin{cases} 1/\\sigma_i & \\sigma_i > 0 \\\\ 0 & \\sigma_i = 0 \\end{cases}",
      geometric: "AA^{-1} = A^{-1}A = I \\quad \\text{(inversa clásica, requiere } \\det(A)\\neq 0\\text{)}",
      properties: [
        "A A^+ A = A \\quad \\text{(1a ecuación de Penrose)}",
        "A^+ A A^+ = A^+ \\quad \\text{(2a ecuación de Penrose)}",
        "(AA^+)^\\top = AA^+ \\quad \\text{(3a ecuación de Penrose)}",
        "\\hat{\\mathbf{x}} = A^+\\mathbf{b} \\text{ es la solución de mínima norma de mínimos cuadrados}",
      ],
    },
    intuition: "Cuando no existe inversa exacta (sistema sobredeterminado o singular), la pseudoinversa da la 'mejor solución posible': mínimo error si hay más ecuaciones que incógnitas, o mínima norma si hay más incógnitas que ecuaciones.",
    development: [
      { label: "Cuándo usar A⁺ vs A⁻¹", body: "$A$ cuadrada, $\\det(A)\\neq 0$: usar $A^{-1}$ (LU o Cholesky, más eficiente).\n$A$ rectangular ($m>n$, sobredeterminado): $A^+$ da solución LS.\n$A$ rectangular ($m<n$, subdeterminado): $A^+$ da solución de mínima norma $L_2$.\n$A$ singular: $A^+$ ignora el kernel, proyecta sobre el complemento." },
      { label: "Conexión con mínimos cuadrados", body: "Para $A\\mathbf{x}=\\mathbf{b}$ sobredeterminado ($m>n$, rango completo): $$A^+ = (A^\\top A)^{-1}A^\\top \\quad \\text{(izquierda)}$$ Para subdeterminado ($m<n$, rango completo): $$A^+ = A^\\top(AA^\\top)^{-1} \\quad \\text{(derecha)}$$ La pseudoinversa unifica ambos casos." },
      { label: "Estabilidad numérica", body: "Calcular $A^{-1}$ explícitamente es numéricamente inestable y raro en la práctica. En su lugar:\n— Resolver $A\\mathbf{x}=\\mathbf{b}$ via `np.linalg.solve` (LU internamente).\n— Para LS: `np.linalg.lstsq` (usa SVD, más estable que ecuaciones normales $(A^\\top A)^{-1}A^\\top\\mathbf{b}$)." },
    ],
    code: `import numpy as np

# Inversa clásica (cuadrada, no singular)
A = np.array([[2.,1.],[1.,3.]])
A_inv = np.linalg.inv(A)
print(np.allclose(A @ A_inv, np.eye(2)))  # True

# Pseudoinversa (Moore-Penrose)
B = np.array([[1,2],[3,4],[5,6]])  # 3x2, sobredeterminado
B_plus = np.linalg.pinv(B)        # 2x3

# B+ resuelve LS: min ||Bx - b||
b = np.array([1., 2., 3.])
x_hat = B_plus @ b
print(f"Solución LS: {x_hat}")
print(f"Residual: {np.linalg.norm(B @ x_hat - b):.4f}")

# Verificar ecuaciones de Penrose
print(np.allclose(B @ B_plus @ B, B))      # 1a ecuación`,
    related: ["SVD", "Sistemas lineales", "Mínimos cuadrados", "Eliminación gaussiana"],
    hasViz: false,
  },
  {
    id: 16, section: "Álgebra Lineal", sectionCode: "II",
    name: "Sistemas de Ecuaciones Lineales",
    tags: ["álgebra", "sistemas"],
    definition: "Conjunto de $m$ ecuaciones lineales en $n$ incógnitas. El análisis de existencia y unicidad de soluciones se determina completamente por el rango de la matriz del sistema y la matriz aumentada.",
    formal: {
      notation: "Sistema $A\\mathbf{x} = \\mathbf{b}$, $A \\in \\mathbb{R}^{m\\times n}$, $\\mathbf{b} \\in \\mathbb{R}^m$",
      body: "\\begin{cases} a_{11}x_1 + \\cdots + a_{1n}x_n = b_1 \\\\ \\vdots \\\\ a_{m1}x_1 + \\cdots + a_{mn}x_n = b_m \\end{cases}",
      geometric: "\\text{Sol. general} = \\mathbf{x}_p + \\ker(A) \\quad \\text{(particular + homogénea)}",
      properties: [
        "\\text{Consistente} \\iff \\text{rank}(A) = \\text{rank}([A|\\mathbf{b}])",
        "\\text{Solución única} \\iff \\text{rank}(A) = n",
        "\\text{Infinitas soluciones} \\iff \\text{rank}(A) = \\text{rank}([A|\\mathbf{b}]) < n",
        "\\text{Teorema de Rouché-Frobenius: clasifica todos los casos}",
      ],
    },
    intuition: "Cada ecuación define un hiperplano en $\\mathbb{R}^n$. La solución es la intersección de todos los hiperplanos. Si son paralelos (inconsistente): sin solución. Si coinciden (dependientes): infinitas. Si se cruzan en un punto: solución única.",
    development: [
      { label: "Clasificación por rango", body: "Sea $r = \\text{rank}(A)$, $\\bar{r} = \\text{rank}([A|\\mathbf{b}])$:\n\n$r < \\bar{r}$: sin solución (inconsistente).\n$r = \\bar{r} = n$: solución única.\n$r = \\bar{r} < n$: infinitas soluciones, espacio afín de dim $n-r$." },
      { label: "Métodos de resolución", body: "Eliminación gaussiana: $O(n^3)$, transforma en forma escalonada.\nFactorización LU: $O(n^3)$ pero reutilizable para múltiples $\\mathbf{b}$.\nFactorización de Cholesky: $O(n^3/3)$ si $A$ es SPD.\nMétodos iterativos (CG, GMRES): para sistemas grandes y esparsos, $O(kn^2)$ con $k\\ll n$." },
      { label: "Solución en ML", body: "Ecuaciones normales de regresión lineal: $(X^\\top X)\\boldsymbol{\\beta} = X^\\top\\mathbf{y}$.\nSi $X^\\top X$ es singular (multicolinealidad): usar SVD/pseudoinversa o regularización ridge: $(X^\\top X + \\lambda I)\\boldsymbol{\\beta} = X^\\top\\mathbf{y}$ — siempre tiene solución única para $\\lambda > 0$." },
    ],
    code: `import numpy as np
from scipy.linalg import solve, lu_factor, lu_solve

A = np.array([[2.,1.,-1.],[1.,3.,2.],[3.,0.,1.]])
b = np.array([8., 13., 11.])

# Método 1: solve directo (LU interno)
x = solve(A, b)
print(f"Solución: {x}")
print(f"Verificación: {np.allclose(A @ x, b)}")

# Método 2: LU factorización (reutilizable)
lu, piv = lu_factor(A)
x1 = lu_solve((lu, piv), b)
b2 = np.array([1., 2., 3.])
x2 = lu_solve((lu, piv), b2)  # Mismo A, distinto b, gratis

# Método 3: ridge para sistema mal condicionado
lam = 1e-4
x_ridge = np.linalg.solve(A.T @ A + lam*np.eye(3), A.T @ b)`,
    related: ["Eliminación gaussiana", "Factorización LU", "Inversa", "Mínimos cuadrados"],
    hasViz: false,
  },
  {
    id: 17, section: "Álgebra Lineal", sectionCode: "II",
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
    id: 18, section: "Álgebra Lineal", sectionCode: "II",
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
    id: 19, section: "Álgebra Lineal", sectionCode: "II",
    name: "Descomposición SVD",
    tags: ["matrices", "factorización", "fundamental"],
    definition: "La Descomposición en Valores Singulares factoriza cualquier matriz $A \\in \\mathbb{R}^{m\\times n}$ (rectangular o singular) en tres matrices. Es la generalización más importante de la eigendescomposición y fundamento de PCA, compresión, y pseudoinversa.",
    formal: {
      notation: "Sea $A \\in \\mathbb{R}^{m\\times n}$, $\\text{rank}(A) = r$",
      body: "A = U\\Sigma V^\\top = \\sum_{i=1}^r \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^\\top",
      geometric: "\\sigma_1 \\geq \\sigma_2 \\geq \\cdots \\geq \\sigma_r > 0 = \\sigma_{r+1} = \\cdots",
      properties: [
        "U \\in \\mathbb{R}^{m\\times m},\\ \\Sigma \\in \\mathbb{R}^{m\\times n},\\ V \\in \\mathbb{R}^{n\\times n} \\text{ — todas ortogonales}",
        "\\sigma_i(A) = \\sqrt{\\lambda_i(A^\\top A)} = \\sqrt{\\lambda_i(AA^\\top)}",
        "\\|A\\|_F^2 = \\sum_i \\sigma_i^2,\\quad \\|A\\|_2 = \\sigma_1",
        "\\text{Mejor aprox. rango-}k\\text{: } A_k = \\sum_{i=1}^k\\sigma_i\\mathbf{u}_i\\mathbf{v}_i^\\top \\text{ (Teorema de Eckart-Young)}",
      ],
    },
    intuition: "SVD dice que cualquier transformación lineal puede descomponerse en: rotar el input ($V^\\top$), escalar los ejes ($\\Sigma$), rotar el output ($U$). Los valores singulares son las 'amplificaciones' en cada dirección — revelan cuánta información hay en cada dimensión.",
    development: [
      { label: "Teorema de Eckart-Young", body: "La mejor aproximación de rango $k$ en norma Frobenius es: $$A_k = \\sum_{i=1}^k \\sigma_i\\mathbf{u}_i\\mathbf{v}_i^\\top$$ con error $\\|A - A_k\\|_F^2 = \\sum_{i=k+1}^r \\sigma_i^2$.\n\nFundamento de compresión de imágenes, NMF, y Latent Semantic Analysis." },
      { label: "SVD y PCA", body: "Para datos centrados $X \\in \\mathbb{R}^{n\\times d}$: $$X = U\\Sigma V^\\top$$ Las columnas de $V$ son los eigenvectores de $X^\\top X = V\\Sigma^2 V^\\top$ (componentes principales). $\\sigma_i^2/n$ son las varianzas explicadas. PCA = SVD de la matriz de datos centrados." },
      { label: "Número de condición", body: "$$\\kappa(A) = \\frac{\\sigma_{\\max}}{\\sigma_{\\min}}$$ Mide sensibilidad numérica. $\\kappa \\approx 1$: bien condicionado. $\\kappa \\gg 1$: ill-conditioned, el gradiente oscilará entre dimensiones → convergencia lenta. Precondicionamiento busca reducir $\\kappa$." },
    ],
    code: `import numpy as np

A = np.array([[1,2,3],[4,5,6],[7,8,9],[10,11,12]], dtype=float)

U, s, Vt = np.linalg.svd(A, full_matrices=False)
print(f"Valores singulares: {s.round(2)}")
print(f"rank(A) ≈ {np.sum(s > 1e-10)}")

# Reconstrucción
A_rec = U @ np.diag(s) @ Vt
print(f"Reconstrucción ok: {np.allclose(A, A_rec)}")

# Mejor aproximación rango-1
k = 1
A_k = s[0] * np.outer(U[:,0], Vt[0,:])
err = np.linalg.norm(A - A_k, 'fro')
print(f"Error rango-1: {err:.4f}")
print(f"Energía capturada: {(s[0]**2/np.sum(s**2)*100):.1f}%")

# Pseudoinversa via SVD
A_plus = Vt.T @ np.diag(1/s) @ U.T`,
    related: ["Eigenvalores", "PCA", "Pseudoinversa", "Norma matricial"],
    hasViz: false,
  },
  {
    id: 20, section: "Álgebra Lineal", sectionCode: "II",
    name: "PCA — Análisis de Componentes Principales",
    tags: ["dimensionalidad", "espectral", "ML"],
    definition: "Técnica de reducción de dimensionalidad que encuentra las direcciones de máxima varianza en los datos. Transforma features correlacionadas en componentes ortogonales (sin correlación), ordenados por varianza decreciente.",
    formal: {
      notation: "Datos $X \\in \\mathbb{R}^{n\\times d}$ centrados ($\\bar{x}=0$), matriz de covarianza $\\Sigma = \\frac{1}{n}X^\\top X$",
      body: "\\mathbf{w}_k = \\arg\\max_{\\|\\mathbf{w}\\|=1,\\, \\mathbf{w}\\perp\\mathbf{w}_{1:k-1}} \\mathbf{w}^\\top\\Sigma\\mathbf{w}",
      geometric: "\\Sigma = Q\\Lambda Q^\\top, \\quad W = Q_{:,1:K} \\in \\mathbb{R}^{d\\times K}",
      properties: [
        "\\text{Varianza explicada por PC}_k\\text{: } \\lambda_k / \\sum_i\\lambda_i",
        "\\text{Los PCs son los eigenvectores de } \\Sigma = \\frac{1}{n}X^\\top X",
        "\\text{Equivalente a SVD de } X\\text{: columnas de }V\\text{ son PCs}",
        "\\text{Compresión: } Z = XW \\in \\mathbb{R}^{n\\times K},\\quad \\hat{X} = ZW^\\top",
      ],
    },
    intuition: "PCA encuentra la 'perspectiva óptima' para ver los datos: el primer eje captura la mayor dispersión, el segundo el mayor restante siendo perpendicular al primero, etc. Es como rotar los ejes de coordenadas para alinearlos con la estructura de los datos.",
    development: [
      { label: "Algoritmo paso a paso", body: "1. Centrar: $X \\leftarrow X - \\bar{X}$.\n2. Calcular covarianza: $\\Sigma = \\frac{1}{n-1}X^\\top X$.\n3. Eigendescomposición: $\\Sigma = Q\\Lambda Q^\\top$.\n4. Seleccionar $K$ primeros eigenvectores.\n5. Proyectar: $Z = XQ_{:,1:K}$.\n\nAlternativa eficiente: SVD directamente sobre $X$." },
      { label: "¿Cuántos componentes elegir?", body: "Criterio de varianza explicada acumulada: elegir $K$ tal que: $$\\frac{\\sum_{i=1}^K\\lambda_i}{\\sum_{i=1}^d\\lambda_i} \\geq 0.95$$ Scree plot: buscar el 'codo' donde los eigenvalores caen bruscamente. En práctica: 90-99% de varianza explicada es común." },
      { label: "Limitaciones", body: "PCA es lineal — no captura estructuras no lineales (usar t-SNE, UMAP).\nSensible a escala — siempre estandarizar antes.\nNo es invariante a outliers — considera PCA robusto.\nMaximizar varianza ≠ maximizar información relevante para la tarea (usar LDA si hay etiquetas)." },
    ],
    code: `import numpy as np
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

# Datos sintéticos correlacionados
np.random.seed(42)
X = np.random.randn(100, 5)
X[:, 2] = 0.8*X[:,0] + 0.2*np.random.randn(100)
X[:, 3] = -0.6*X[:,1] + 0.3*np.random.randn(100)

# PCA manual
X_c = X - X.mean(axis=0)
Sigma = X_c.T @ X_c / (len(X)-1)
lams, Q = np.linalg.eigh(Sigma)
# eigh devuelve orden ascendente → invertir
lams, Q = lams[::-1], Q[:, ::-1]

var_exp = lams / lams.sum()
print("Varianza explicada:", var_exp.round(3))

# Con sklearn
pca = PCA(n_components=2)
Z = pca.fit_transform(X)
print(f"Varianza acumulada (2 PCs): {pca.explained_variance_ratio_.sum():.3f}")`,
    related: ["SVD", "Eigenvalores", "Reducción de dimensionalidad", "t-SNE"],
    hasViz: false,
  },
  {
    id: 21, section: "Álgebra Lineal", sectionCode: "II",
    name: "Tensores y Operaciones Tensoriales",
    tags: ["tensores", "deep learning"],
    definition: "Generalización de escalares (rango 0), vectores (rango 1) y matrices (rango 2) a arreglos multidimensionales de rango arbitrario. Son el objeto de datos fundamental en deep learning.",
    formal: {
      notation: "Tensor de rango $r$: $\\mathcal{T} \\in \\mathbb{R}^{d_1 \\times d_2 \\times \\cdots \\times d_r}$",
      body: "\\mathcal{T}_{i_1 i_2 \\cdots i_r} \\in \\mathbb{R}, \\quad i_k \\in \\{1,\\ldots,d_k\\}",
      geometric: "\\text{Producto tensorial: } (\\mathbf{u}\\otimes\\mathbf{v})_{ij} = u_i v_j \\quad \\in \\mathbb{R}^{m\\times n}",
      properties: [
        "\\text{Escalar: rango 0; Vector: rango 1; Matriz: rango 2}",
        "\\text{Contracción (einsum): } C_{ij} = \\sum_k A_{ik}B_{kj} \\text{ (product matricial)}",
        "\\text{Reshape: mismo número de elementos, distintas dimensiones}",
        "\\text{Broadcasting: operaciones entre tensores de distintas formas}",
      ],
    },
    intuition: "Un tensor es como una tabla de datos multidimensional. Un batch de imágenes en color es un tensor de rango 4: (batch, alto, ancho, canales). Las operaciones tensoriales son las capas de una red neuronal.",
    development: [
      { label: "Tensores en Deep Learning", body: "Rango 0: pérdida (loss), escalar.\nRango 1: bias de una capa $\\mathbf{b} \\in \\mathbb{R}^d$.\nRango 2: pesos $W \\in \\mathbb{R}^{d_{out}\\times d_{in}}$, batch de vectores.\nRango 3: secuencias $(B, T, d)$ — batch, tiempo, embedding.\nRango 4: imágenes $(B, C, H, W)$ — batch, canales, alto, ancho." },
      { label: "Einstein summation (einsum)", body: "Notación unificada para contracciones tensoriales: $$C_{ij} = \\sum_k A_{ik}B_{kj} \\rightarrow \\texttt{ij,jk->ik}$$ Casos especiales: `ii->` (traza), `ij->ji` (transpuesta), `bij,bjk->bik` (batch matmul). Más legible y a veces más eficiente que operaciones explícitas." },
      { label: "Descomposiciones tensoriales", body: "Análogo de SVD para tensores:\n\nDescomposición CP: $\\mathcal{T} \\approx \\sum_{r=1}^R \\mathbf{a}_r \\otimes \\mathbf{b}_r \\otimes \\mathbf{c}_r$ (NP-hard en general).\nTucker: generaliza la diagonalización a tensores.\n\nUsadas en compresión de redes neuronales (tensor decomposition for model compression)." },
    ],
    code: `import numpy as np

# Tensores básicos
escalar = np.array(3.14)              # rango 0, shape ()
vector  = np.array([1, 2, 3])         # rango 1, shape (3,)
matriz  = np.eye(3)                   # rango 2, shape (3,3)
tensor3 = np.random.randn(4, 5, 6)   # rango 3, shape (4,5,6)

# Batch de imágenes: (batch, canales, alto, ancho)
imgs = np.random.randn(32, 3, 224, 224)
print(f"Shape: {imgs.shape}, ndim: {imgs.ndim}")

# Einsum: herramienta universal
A = np.random.randn(3, 4)
B = np.random.randn(4, 5)
C = np.einsum('ij,jk->ik', A, B)      # matmul
print(np.allclose(C, A @ B))          # True

# Batch matmul
X = np.random.randn(8, 3, 4)  # 8 matrices 3x4
Y = np.random.randn(8, 4, 5)  # 8 matrices 4x5
Z = np.einsum('bij,bjk->bik', X, Y)   # (8,3,5)`,
    related: ["Matriz", "Producto punto", "Convolución", "Broadcasting"],
    hasViz: false,
  },
  {
    id: 22, section: "Álgebra Lineal", sectionCode: "II",
    name: "Distancia Euclídea",
    tags: ["métricas", "geometría"],
    definition: "Distancia estándar entre dos puntos en $\\mathbb{R}^n$, generalización del teorema de Pitágoras. Inducida por la norma $L_2$. Base de algoritmos de clustering, kNN y kernels gaussianos.",
    formal: {
      notation: "Sean $\\mathbf{x}, \\mathbf{y} \\in \\mathbb{R}^n$",
      body: "d(\\mathbf{x},\\mathbf{y}) = \\|\\mathbf{x}-\\mathbf{y}\\|_2 = \\sqrt{\\sum_{i=1}^n (x_i - y_i)^2}",
      geometric: "d^2(\\mathbf{x},\\mathbf{y}) = \\|\\mathbf{x}\\|^2 - 2\\mathbf{x}\\cdot\\mathbf{y} + \\|\\mathbf{y}\\|^2",
      properties: [
        "\\text{Simetría: } d(\\mathbf{x},\\mathbf{y}) = d(\\mathbf{y},\\mathbf{x})",
        "\\text{Desig. triangular: } d(\\mathbf{x},\\mathbf{z}) \\leq d(\\mathbf{x},\\mathbf{y}) + d(\\mathbf{y},\\mathbf{z})",
        "d(\\mathbf{x},\\mathbf{y}) = 0 \\iff \\mathbf{x} = \\mathbf{y}",
        "\\text{Maldición de la dimensión: } \\mathbb{E}[d] \\sim \\sqrt{n} \\text{ crece con la dim}",
      ],
    },
    intuition: "En $\\mathbb{R}^2$: distancia en línea recta entre dos puntos. En dimensión alta, los puntos tienden a estar todos a distancias similares entre sí (concentración de la medida), haciendo que la distancia euclídea sea menos informativa.",
    development: [
      { label: "Maldición de la dimensión", body: "En $\\mathbb{R}^n$ con puntos uniformes en $[0,1]^n$: $$\\frac{d_{\\max} - d_{\\min}}{d_{\\min}} \\to 0 \\text{ cuando } n \\to \\infty$$ Todos los puntos se vuelven equidistantes. kNN y clustering euclídeo pierden poder discriminativo en $d > 100$." },
      { label: "Cálculo eficiente", body: "Para matrices $X \\in \\mathbb{R}^{n\\times d}$, $Y \\in \\mathbb{R}^{m\\times d}$, la matriz de distancias al cuadrado: $$D_{ij}^2 = \\|\\mathbf{x}_i - \\mathbf{y}_j\\|^2 = \\|\\mathbf{x}_i\\|^2 - 2\\mathbf{x}_i\\cdot\\mathbf{y}_j + \\|\\mathbf{y}_j\\|^2$$ Expandir como $\\|X\\|^2 - 2XY^\\top + \\|Y\\|^2$ (operaciones matriciales, $O(nmd)$ pero vectorizado)." },
      { label: "Distancia de Mahalanobis", body: "Generalización que incorpora la covarianza $\\Sigma$: $$d_M(\\mathbf{x},\\mathbf{y}) = \\sqrt{(\\mathbf{x}-\\mathbf{y})^\\top\\Sigma^{-1}(\\mathbf{x}-\\mathbf{y})}$$ Invariante a transformaciones lineales. Si $\\Sigma = I$: euclídea. Más apropiada cuando features tienen distintas escalas o correlaciones." },
    ],
    code: `import numpy as np

x = np.array([1., 2., 3.])
y = np.array([4., 0., -1.])

# Distancia euclídea
d = np.linalg.norm(x - y)
print(f"d(x,y) = {d:.4f}")

# Matriz de distancias entre conjuntos de puntos
def dist_matrix(X, Y):
    """O(nmd) vectorizado."""
    X2 = np.sum(X**2, axis=1, keepdims=True)
    Y2 = np.sum(Y**2, axis=1, keepdims=True)
    return np.sqrt(np.maximum(X2 - 2*X@Y.T + Y2.T, 0))

X = np.random.randn(50, 10)
Y = np.random.randn(30, 10)
D = dist_matrix(X, Y)
print(f"Matriz distancias: {D.shape}")   # (50, 30)

# Distancia de Mahalanobis
from scipy.spatial.distance import mahalanobis
Sigma = np.cov(X.T)
d_mah = mahalanobis(X[0], X[1], np.linalg.inv(Sigma))`,
    related: ["Norma L2", "Similitud coseno", "kNN", "Clustering"],
    hasViz: false,
  },
  {
    id: 23, section: "Álgebra Lineal", sectionCode: "II",
    name: "Eliminación Gaussiana",
    tags: ["sistemas lineales", "algoritmos"],
    definition: "Algoritmo para resolver sistemas lineales $A\\mathbf{x}=\\mathbf{b}$ transformando la matriz aumentada en forma escalonada reducida mediante operaciones elementales de fila. Base de la factorización LU.",
    formal: {
      notation: "Operaciones elementales de fila: $R_i \\leftrightarrow R_j$, $R_i \\leftarrow \\alpha R_i$, $R_i \\leftarrow R_i + \\beta R_j$",
      body: "[A|\\mathbf{b}] \\xrightarrow{\\text{elim.}} [U|\\mathbf{c}] \\quad \\text{(forma escalonada superior)}",
      geometric: "A = LU \\quad \\text{(factorización LU)}",
      properties: [
        "\\text{Costo computacional: } O(n^3/3) \\text{ multiplicaciones}",
        "\\text{Pivoteo parcial: intercambiar filas para estabilidad numérica}",
        "\\text{PA} = LU \\text{ con pivoteo (P = matriz de permutación)}",
        "\\text{Sustitución hacia atrás: } O(n^2) \\text{ para resolver } U\\mathbf{x}=\\mathbf{c}",
      ],
    },
    intuition: "Eliminación gaussiana es como limpiar un sistema de ecuaciones: usar una ecuación para eliminar una incógnita de todas las demás, repetir hasta tener una sola incógnita, y luego deshacer el camino (sustitución hacia atrás).",
    development: [
      { label: "Pivoteo y estabilidad numérica", body: "Sin pivoteo: el pivote puede ser cero (error) o muy pequeño (inestabilidad numérica — amplificación de errores de redondeo).\n\nPivoteo parcial: elegir la fila con máximo $|a_{ij}|$ como pivote. Estándar en la práctica.\nPivoteo completo: máximo en toda la submatriz — muy estable pero $O(n^3)$ búsquedas." },
      { label: "Factorización LU", body: "La eliminación gaussiana es equivalente a factorizar $PA = LU$:\n— $L$: triangular inferior, $l_{ij}$ son los multiplicadores usados.\n— $U$: triangular superior, la forma escalonada.\n\nVentaja: con $A = LU$ fijo, resolver $A\\mathbf{x}=\\mathbf{b}$ para múltiples $\\mathbf{b}$ cuesta solo $O(n^2)$ por $\\mathbf{b}$." },
      { label: "Caso SPD: Cholesky", body: "Si $A$ es simétrica definida positiva: $A = LL^\\top$ donde $L$ es triangular inferior.\nMás eficiente: solo $O(n^3/6)$ operaciones, siempre estable sin pivoteo.\nUso: regresión lineal con regularización, factor de riesgo, distribuciones gaussianas." },
    ],
    code: `import numpy as np
from scipy.linalg import lu, solve_triangular

A = np.array([[2.,1.,-1.],[4.,3.,1.],[2.,2.,2.]])
b = np.array([8., 14., 12.])

# Eliminación gaussiana manual (ilustrativa)
def gauss_eliminacion(A, b):
    n = len(b)
    Ab = np.hstack([A.astype(float), b[:,None]])
    for col in range(n):
        # Pivoteo parcial
        max_row = col + np.argmax(np.abs(Ab[col:, col]))
        Ab[[col, max_row]] = Ab[[max_row, col]]
        for row in range(col+1, n):
            factor = Ab[row, col] / Ab[col, col]
            Ab[row] -= factor * Ab[col]
    # Sustitución hacia atrás
    x = np.zeros(n)
    for i in range(n-1, -1, -1):
        x[i] = (Ab[i,-1] - Ab[i,i+1:n] @ x[i+1:]) / Ab[i,i]
    return x

x = gauss_eliminacion(A, b)
print(f"Solución: {x}")

# scipy: PA=LU
P, L, U = lu(A)
y = solve_triangular(L, P@b, lower=True)
x2 = solve_triangular(U, y)
print(np.allclose(x, x2))`,
    related: ["Sistemas lineales", "Factorización LU", "Cholesky", "Inversa"],
    hasViz: false,
  },
  {
    id: 24, section: "Álgebra Lineal", sectionCode: "II",
    name: "Factorización LU",
    tags: ["matrices", "factorización", "algoritmos"],
    definition: "Descompone $A = LU$ (o $PA=LU$ con pivoteo) en producto de matriz triangular inferior $L$ y superior $U$. Permite resolver sistemas lineales eficientemente para múltiples vectores del lado derecho.",
    formal: {
      notation: "Sea $A \\in \\mathbb{R}^{n\\times n}$ no singular",
      body: "PA = LU, \\quad L = \\begin{pmatrix} 1 & & \\\\ l_{21} & 1 & \\\\ \\vdots & \\ddots & 1 \\end{pmatrix},\\quad U = \\begin{pmatrix} u_{11} & \\cdots & u_{1n} \\\\ & \\ddots & \\vdots \\\\ & & u_{nn} \\end{pmatrix}",
      geometric: "A\\mathbf{x}=\\mathbf{b} \\Rightarrow L\\mathbf{y}=P\\mathbf{b} \\text{ (forward)},\\; U\\mathbf{x}=\\mathbf{y} \\text{ (backward)}",
      properties: [
        "\\det(A) = \\det(P)^{-1}\\prod_i u_{ii} \\quad \\text{(producto diagonal de U)}",
        "\\text{Factorizar: } O(n^3/3);\\quad \\text{Resolver: } O(n^2) \\text{ por } \\mathbf{b}",
        "l_{ij} = a_{ij}^{(j)} / a_{jj}^{(j)} \\quad \\text{(multiplicadores de eliminación)}",
      ],
    },
    intuition: "LU separa el trabajo duro (factorizar $A$, costoso) del trabajo fácil (resolver con $L$ y $U$, barato). Si necesitas resolver el mismo sistema con 1000 vectores $\\mathbf{b}$ distintos, factorizas una vez y resuelves 1000 veces en $O(n^2)$ cada una.",
    development: [
      { label: "Algoritmo de Doolittle", body: "Construcción explícita elemento a elemento:\n$$u_{kj} = a_{kj} - \\sum_{s=1}^{k-1} l_{ks}u_{sj}, \\quad j \\geq k$$\n$$l_{ik} = \\frac{1}{u_{kk}}\\left(a_{ik} - \\sum_{s=1}^{k-1} l_{is}u_{sk}\\right), \\quad i > k$$\nNormalización: $l_{kk} = 1$ (Doolittle) o $u_{kk}=1$ (Crout)." },
      { label: "Cuándo usar LU vs otras factorizaciones", body: "LU ($PA=LU$): propósito general, $A$ cuadrada.\nCholesky ($A=LL^\\top$): $A$ SPD, el doble de eficiente.\nQR ($A=QR$): overdetermined systems (LS), más estable numéricamente.\nSVD ($A=U\\Sigma V^\\top$): máxima estabilidad, más costoso, matrices singulares." },
      { label: "Aplicaciones directas", body: "Cálculo de determinante: $\\det(A) = \\text{sign}(P)\\cdot u_{11}\\cdots u_{nn}$.\nCálculo de $A^{-1}$: resolver $LU\\mathbf{x}_i = \\mathbf{e}_i$ para cada columna de $I$.\nGaussian process inference: resolver sistemas con matriz de kernel.\nAnálisis de circuitos, FEM, y sistemas de control." },
    ],
    code: `import numpy as np
from scipy.linalg import lu_factor, lu_solve, lu

A = np.array([[3.,1.,2.],[6.,4.,5.],[9.,7.,11.]])

# Factorización PA = LU
P, L, U = lu(A)
print("L:", L.round(3))
print("U:", U.round(3))
print("PA=LU:", np.allclose(P@A, L@U))

# Para resolver múltiples sistemas (modo eficiente)
lu_factored = lu_factor(A)  # factoriza una vez

for b in [np.array([1.,2.,3.]), np.array([4.,5.,6.])]:
    x = lu_solve(lu_factored, b)  # O(n^2) por solución
    print(f"x={x.round(3)}, check={np.allclose(A@x, b)}")

# Determinante via LU
sign, logdet = np.linalg.slogdet(A)
print(f"det(A) = {sign * np.exp(logdet):.4f}")`,
    related: ["Eliminación gaussiana", "Cholesky", "Sistemas lineales", "Inversa"],
    hasViz: false,
  },
];
