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

positional encoding이 필요없는 이유를 아직 잘 모르겠네

> Besides backbone architectures, another line of work formulates semantic segmentation as a structured prediction problem, and focuses on designing modules and operators, which can effectively capture contextual information. A representative example in this area is dilated convolution [4, 5], which increases the receptive field by “inflating” the kernel with holes.
팽창 합성곱을 사용하여 contextual information을 효과적으로 캡쳐하는 방법에 대한 연구

> **First, the proposed encoder avoids interpolating positional codes when performing inference on images with resolutions different from the training one.** As a result, our encoder can easily adapt to **arbitrary** test resolutions without impacting the performance. In addition, the hierarchical part enables the encoder to generate both high-resolution **fine features** and low-resolution **coarse features**, this is in contrast to ViT that can only produce single low-resolution feature maps with fixed resolutions. **Second, we propose a lightweight MLP decoder where the key idea is to take advantage of the Transformer-induced features where the attentions of lower layers tend to stay local, whereas the ones of the highest layers are highly non-local.** By aggregating the information from different layers, the MLP decoder combines both local and global attention. As a result, we obtain a simple and straightforward decoder that renders powerful representations.

First,.. 문장을 통해 기존에는 학습 이미지와 추론 이미지의 resolution이 다를 때 interpolating positional codes가 필요했다는 것을 알 수 있다. 왜?

Hierarchical encoder는 여러 해상도의 feature map(multi-scale features)을 생성한다.
높은 해상도의 feature는 세부 정보(local detail)를 더 잘 보존하고,
낮은 해상도의 feature는 더 넓은 문맥(global context)을 담는다.
반면 ViT는 고정된 해상도의 단일 feature map만 생성한다

lightweight MLP decoder는 Transformer-induced fetures를 활용하는데, 낮은 층에서 얻은 features는 국소적인 정보를 담고, 높은 층에서 얻은 features는 전역적인 정보를 담는다.
즉, MLP decoder는 이 두 feature를 통합해서 전역적이고 국소적인 정보를 동시에 얻는다.

> **Hierarchical Feature Representation.** Unlike ViT that can only generate a single-resolution feature map, the goal of this module is, given an input image, to generate CNN-like multi-level features. These features provide high-resolution coarse features and low-resolution fine-grained features that usually boost the performance of semantic segmentation. More precisely, given an input image with a resolution of \(H \times W \times 3\), we **perform** patch merging to obtain a hierarchical feature map \(F_i\) with a resolution of \[\frac{H}{2^{i+1}} \times \frac{W}{2^{i+1}} \times C_i,\] where \(i \in \{1,2,3,4\}\), and \(C_{i+1}\) is larger than \(C_i\).

> **Overlapped Patch Merging.** Given an image patch, the patch merging process used in ViT unifies a \(N \times N \times 3\) patch into a \(1 \times 1 \times C\) vector. This can easily be extended to unify a \(2 \times 2 \times C_i\) feature patch into a \(1 \times 1 \times C_{i+1}\) vector to obtain hierarchical feature maps. Using this, we can shrink our hierarchical features from \[F_1 \left(\frac{H}{4} \times \frac{W}{4} \times C_1\right)\] to \[F_2 \left(\frac{H}{8} \times \frac{W}{8} \times C_2\right),\] and then iterate for any other feature map in the hierarchy. This process was initially designed to combine non-overlapping image or feature patches. Therefore, it fails to preserve the local continuity around those patches. Instead, we use an overlapping patch merging process. To this end, we define \(K\), \(S\), and \(P\), where \(K\) is the patch size, \(S\) is the stride between two adjacent patches, and \(P\) is the padding size. In our experiments, we set \[K = 7,\quad S = 4,\quad P = 3\] and \[K = 3,\quad S = 2,\quad P = 1\] to perform overlapping patch merging and produce features with the same size as the non-overlapping process.

(그림 그려봐) -> 
```
입력 이미지
      ↓
F1 : H/4 × W/4  (세부 정보 많음)
      ↓
F2 : H/8 × W/8
      ↓
F3 : H/16 × W/16
      ↓
F4 : H/32 × W/32 (전역 문맥 많음)
```