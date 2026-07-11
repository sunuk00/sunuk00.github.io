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