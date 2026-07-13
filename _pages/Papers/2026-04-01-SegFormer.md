---
title: "SegFormer: Simple and Efficient Design for Semantic Segmentation with Transformers"
tags:
    - Computer Vision
date: "2026-04-01"
bookmark: true
---

[SegFormer: Simple and Efficient Design for Semantic Segmentation with Transformers](https://arxiv.org/abs/2105.15203)

## Review
> SegFormer has two appealing features: 1) SegFormer comprises a novel hierarchically structured Transformer encoder which outputs multiscale features. It does not need positional encoding, thereby avoiding the interpolation of positional codes which leads to decreased performance when the testing resolution differs from training. 2) SegFormer avoids complex decoders. The proposed MLP decoder aggregates information from different layers, and thus combining both local attention and global attention to render powerful representations. We show that this simple and lightweight design is the key to efficient segmentation on Transformers. 

대표적인 2가지 SegFormer의 특징이다.

> **First, the proposed encoder avoids interpolating positional codes when performing inference on images with resolutions different from the training one.** As a result, our encoder can easily adapt to **arbitrary** test resolutions without impacting the performance. In addition, the hierarchical part enables the encoder to generate both high-resolution **fine features** and low-resolution **coarse features**, this is in contrast to ViT that can only produce single low-resolution feature maps with fixed resolutions. **Second, we propose a lightweight MLP decoder where the key idea is to take advantage of the Transformer-induced features where the attentions of lower layers tend to stay local, whereas the ones of the highest layers are highly non-local.** By aggregating the information from different layers, the MLP decoder combines both local and global attention. As a result, we obtain a simple and straightforward decoder that renders powerful representations.

Hierarchical encoder는 여러 해상도의 feature map(multi-scale features)을 생성한다.
높은 해상도의 feature는 세부 정보(local detail)를 더 잘 보존하고,
낮은 해상도의 feature는 더 넓은 문맥(global context)을 담는다.
반면 ViT는 고정된 해상도의 단일 feature map만 생성한다

lightweight MLP decoder는 Transformer-induced fetures를 활용하는데, 낮은 층에서 얻은 features는 국소적인 정보를 담고, 높은 층에서 얻은 features는 전역적인 정보를 담는다.
즉, MLP decoder는 이 두 feature를 통합해서 전역적이고 국소적인 정보를 동시에 얻는다.

<figure style="margin: 0; text-align: center;">
    <img src="/assets/img/posts/Papers/segformer001.png" width="700" height="380" />
    <figcaption>SegFormer Architecture</figcaption>
    <img src="/assets/img/posts/Papers/segformer006.png" width="500" height="350" />
    <figcaption>ViT Architecture</figcaption>
</figure> 


### Hierachical Transformer Encoder
> Given an image of size H × W × 3, we first divide it into patches of size 4 × 4. Contrary to ViT that uses patches of size 16 × 16, using smaller patches favors the dense prediction task.​‌

ViT는 16 × 16 크기의 패치를 사용하지만, Segformer는 이미지를 4 × 4 크기의 더 작은 패치로 나눈다. 이러는 이유는 dense prediction task에 더 유리하기 때문인데, 즉 세밀한 구조를 유지할 수 있다.

####  Hierarchical Feature Representation
> Unlike ViT that can only generate a single-resolution feature map, the goal of this module is, given an input image, to generate CNN-like multi-level features. These features provide high-resolution coarse features and low-resolution fine-grained features that usually boost the performance of semantic segmentation. More precisely, given an input image with a resolution of $H \times W \times 3$, we **perform** patch merging to obtain a hierarchical feature map $F_i$ with a resolution of $\frac{H}{2^{i+1}} \times \frac{W}{2^{i+1}} \times C_i,$ where $i \in \{1,2,3,4\}$, and $C_{i+1}$ is larger than $C_i$.

입력 이미지로부터 CNN과 같은 계층적(multi-level) feature를 생성한다. 초기 단계의 feature는 높은 해상도를 유지하여 위치 및 경계 정보를 보존하고, 깊은 단계의 feature는 낮은 해상도이지만 더 풍부한 semantic 정보를 포함한다.

#### Overlapped Patch Merging
> Given an image patch, the patch merging process used in ViT unifies a $N \times N \times 3$ patch into a $1 \times 1 \times C$ vector. This can easily be extended to unify a $2 \times 2 \times C_i$ feature patch into a $1 \times 1 \times C_{i+1}$ vector to obtain hierarchical feature maps. Using this, we can **shrink** our hierarchical features from $F_1 \left(\frac{H}{4} \times \frac{W}{4} \times C_1\right)$ to $F_2 \left(\frac{H}{8} \times \frac{W}{8} \times C_2\right)$, and then iterate for any other feature map in the hierarchy. This process was initially designed to combine non-overlapping image or feature patches. Therefore, it fails to preserve the local continuity around those patches. Instead, we use an overlapping patch merging process. To this end, we define $K$, $S$, and $P$, where $K$ is the patch size, $S$ is the stride between two adjacent patches, and $P$ is the padding size. In our experiments, we set $K = 7,\quad S = 4,\quad P = 3$ and $K = 3,\quad S = 2,\quad P = 1$ to perform overlapping patch merging and produce features with the same size as the non-overlapping process.

SegFormer는 각 계층의 Transformer block에서 Self-Attention을 수행한다. 즉, 해당 Self-Attention에 넣어줘야 할 패치가 필요하다.

ViT의 경우에는 이미지를 16x16x3으로 나눠서 1x1xC Vector로 flatten을 하여 Self-Attetion의 학습을 진행했다. SegFormer의 경우에는 이 ViT의 아이디어를 feature map에 적용시켰다.

즉, 입력에 대하여 overlapping patch embedding을 수행하고 만들어진 feature map을 픽셀 단위로 flatten하여 Self-Attention의 입력으로 넣어주어 새로운 feature map을 생성한다.

SegFormer가 overlapping하여 patch를 만드는 이유가 local continuity를 보존하기 위함임을 기억하자.

아래 그림이 이해에 도움을 준다.

<figure style="margin: 0; text-align: center;">
    <img src="/assets/img/posts/Papers/segformer002.jpg" width="900" height="500" />
    <figcaption></figcaption>
</figure> 

#### Efficient Self-Attention
> The main computation bottleneck of the encoders is the self-attention layer. In the original multi-head self-attention process, each of the heads $Q$, $K$, and $V$ have the same dimensions $N \times C$, where $N = H \times W$ is the length of the sequence. The self-attention is estimated as: $\text{Attention}(Q,K,V) = \text{Softmax}\left(\frac{QK^T}{\sqrt{d_{\text{head}}}}\right)V.$ The computational complexity of this process is $O(N^2)$, which is **prohibitive** for large image resolutions. Instead, we use the sequence reduction process introduced in [8]. This process uses a reduction ratio $R$ to reduce the length of the sequence as follows: $$\hat{K} = \text{Reshape}{(\frac{N}{R},\, C \cdot R)}(K)$$ $$K = \text{Linear}{(C \cdot R,\; C)}(\hat{K}),$$ where $K$ is the sequence to be reduced, $\text{Reshape}{(\frac{N}{R},\, C \cdot R)}(K)$ refers to reshaping $K$ to one with shape $\frac{N}{R} \times (C \cdot R)$, and $\text{Linear}{(C_{\text{in}}, C_{\text{out}})}(\cdot)$ refers to a linear layer taking a $C_{\text{in}}$-dimensional tensor as input and generating a $C_{\text{out}}$-dimensional tensor as output. Therefore, the new $K$ has dimensions $\frac{N}{R} \times C$. As a result, the complexity of the self-attention mechanism is reduced from $O(N^2)$ to $O\left(\frac{N^2}{R}\right)$. In our experiments, we set $R$ to $[64, 16, 4, 1]$ from stage-1 to stage-4. 

<figure style="margin: 0; text-align: center;">
    <img src="/assets/img/posts/Papers/segformer003.jpg" width="700" height="300" />
    <figcaption></figcaption>
</figure> 
위에서 보았듯이, Self-Attention에 입력되는 토큰은 총 $N = H \times W$개이다. 즉, 입력 이미지의 해상도가 높을수록 Self-Attention의 계산량이 기하급수적으로 증가한다.

<figure style="margin: 0; text-align: center;">
    <img src="/assets/img/posts/Papers/segformer004.jpg" width="500" height="400" />
    <figcaption></figcaption>
</figure> 
K의 형태를 바꿔서 $\hat{K}$로 표현한다. 

<figure style="margin: 0; text-align: center;">
    <img src="/assets/img/posts/Papers/segformer005.jpg" width="600" height="300" />
    <figcaption></figcaption>
</figure> 
$\hat{K}$를 Linear Layer에 넣어서 다시 $K$로 바꾼다. 행렬 곱을 하는데, 즉 $\hat{K}$에 가중치 W를 곱해서 채널을 C·R → C로 줄인다. 이때, R은 stage마다 다르게 설정한다. (stage-1: 64, stage-2: 16, stage-3: 4, stage-4: 1)

이렇게 Q와 K의 차원이 맞춰져서 Attention(Q,K,V)를 계산할 수 있다. 즉, Self-Attention의 계산량을 $O(N^2)$에서 $O(N^2/R)$로 줄일 수 있다.


#### Mix-FFN
> ViT uses positional encoding (PE) to introduce location information. However, the resolution of PE is fixed. Therefore, when the test resolution is different from the training one, the positional code needs to be interpolated and this often leads to dropped accuracy. To alleviate this problem, CPVT [54] uses a $3 \times 3$ Conv together with the PE to implement a data-driven PE. We argue that positional encoding is actually not necessary for semantic segmentation. Instead, we introduce Mix-FFN which considers the effect of zero padding to leak location information [69], by directly using a $3 \times 3$ Conv in the feed-forward network (FFN). Mix-FFN can be formulated as: $$x_{\text{out}} = \text{MLP}\Big(\text{GELU}\big(\text{Conv}_{3\times3}(\text{MLP}(x_{\text{in}}))\big)\Big) + x_{\text{in}},$$ where $x_{\text{in}}$ is the feature from the self-attention module. Mix-FFN mixes a $3\times 3$ convolution and an MLP into each FFN. In our experiments, we will show that a $3 \times 3$ convolution is sufficient to provide positional information for Transformers. In particular, we use depth-wise convolutions for reducing the number of parameters and improving efficiency.

Encoder의 마지막으로 Mix-FFN을 사용하여 positional encoding 없이도 위치 정보를 보존한다. Mix-FFN은 3x3 Conv와 MLP를 결합하여 FFN을 구성한다. 3x3 Conv는 zero padding으로 인해 위치 정보가 누출되는 효과를 고려하여 위치 정보를 제공한다. 또한, depth-wise convolution을 사용하여 파라미터 수를 줄이고 효율성을 높인다.


### Lightweight All-MLP Decoder
> SegFormer incorporates a lightweight decoder consisting only of MLP layers and this avoiding the hand-crafted and computationally demanding components typically used in other methods. The key to enabling such a simple decoder is that our hierarchical Transformer encoder has a larger effective receptive field (ERF) than traditional CNN encoders.

SegFormer가 이렇게 간단한 MLP decoder를 사용할 수 있는 이유는, hierarchical Transformer encoder가 전통적인 CNN encoder보다 더 큰 effective receptive field(ERF)를 가지기 때문..

> The proposed All-MLP decoder consists of four main steps. First, multi-level features $F_i$ from the MiT encoder go through an MLP layer to unify the channel dimension. Then, in a second step, features are up-sampled to $\frac{H}{4} \times \frac{W}{4}$ and concatenated together. Third, an MLP layer is adopted to fuse the concatenated features $F$. Finally, another MLP layer takes the fused feature to predict the segmentation mask $M$ with a $\frac{H}{4} \times \frac{W}{4} \times N_{\mathrm{cls}}$ resolution, where $N_{\mathrm{cls}}$ is the number of categories.
>
> This lets us formulate the decoder as:
>
> $$
> \hat{F}_i = \mathrm{Linear}(C_i, C)(F_i), \quad \forall i
> $$
>
> $$
> \hat{F}_i = \mathrm{Upsample}\!\left(\frac{H}{4} \times \frac{W}{4}\right)(\hat{F}_i), \quad \forall i
> $$
>
> $$
> F = \mathrm{Linear}(4C, C)\!\left(\mathrm{Concat}(\hat{F}_i)\right), \quad \forall i
> $$
>
> $$
> M = \mathrm{Linear}(C, N_{\mathrm{cls}})(F)
> $$
>
> where $M$ refers to the predicted mask, and $\mathrm{Linear}(C_{\mathrm{in}}, C_{\mathrm{out}})(\cdot)$ refers to a linear layer with $C_{\mathrm{in}}$ and $C_{\mathrm{out}}$ as input and output vector dimensions, respectively.


### Experiments


## My Thoughts
SegFormer의 핵심은 Encoder에 있는 거 같다. 물론 Decoder에서 MLP를 사용하여 계산량을 줄이고 ERF를 효과적으로 넓힌 것은 사실이지만, Encoder에서 다양한 Contextual Information을 담은 Multi-scale features를 추출하지 못했다면, Decoder에서 MLP를 사용하여 ERF를 넓히는 것은 큰 의미가 없음을 실험 Table1.(d)를 통해 알 수 있다. 따라서 SegFormer의 Encoder가 Multi-scale features를 추출하는 것이 핵심이라고 생각한다.

## Questions
**Q1.** SegFormer는 positional encoding을 하지 않지만, 기존 ViT는 학습 이미지와 추론 이미지의 resolution이 다를 때 interpolating positional codes가 필요했다. 왜지?

**Q2.** Efficient Self-Attention에서 토큰의 배열을 N X C를 N/R X C*R로 바꾸면, 위치 관계가 깨지지 않나? 애초에 attention은 위치 관계를 고려하지 않아서 상관없나?

**Q3.** High resolution을 self-attention에 넣으면 계산량이 너무 많아져서, K값을 줄여서 계산량을 줄였는데, linear layer를 거치면서 K값이 줄어들면, 결국 attention을 계산할 때, K값이 줄어든 만큼 정보가 손실되지 않을까? R로 나눈 것과 나누지 않은 것의 trade-off가 존재하지 않을까?

**Q4.** 왜 하필 Q, K, V 중에서 K를 줄이는 걸까? Q나 V를 줄이면 안되는 이유가 있을까?


