(() => {
  const hero = document.querySelector('.hero');
  const lane = document.querySelector('.battle-lane');
  const unitLayer = lane?.querySelector('.unit-layer');
  const routeOverlay = lane?.querySelector('.route-overlay');
  const barrageFlag = lane?.querySelector('.barrage-flag');
  if (!hero || !lane || !unitLayer || !routeOverlay) {
    return;
  }

  const WORLD_BOUNDS = { width: 1000, height: 600 };

  const ROUTES = {
    "route1": [
      {
        "x": 13,
        "y": 128
      },
      {
        "x": 18,
        "y": 119
      },
      {
        "x": 27,
        "y": 113
      },
      {
        "x": 35,
        "y": 107
      },
      {
        "x": 43,
        "y": 102
      },
      {
        "x": 51,
        "y": 94
      },
      {
        "x": 59,
        "y": 89
      },
      {
        "x": 70,
        "y": 85
      },
      {
        "x": 82,
        "y": 80
      },
      {
        "x": 91,
        "y": 75
      },
      {
        "x": 99,
        "y": 69
      },
      {
        "x": 107,
        "y": 62
      },
      {
        "x": 116,
        "y": 58
      },
      {
        "x": 126,
        "y": 56
      },
      {
        "x": 136,
        "y": 55
      },
      {
        "x": 147,
        "y": 59
      },
      {
        "x": 156,
        "y": 62
      },
      {
        "x": 164,
        "y": 66
      },
      {
        "x": 173,
        "y": 70
      },
      {
        "x": 181,
        "y": 75
      },
      {
        "x": 189,
        "y": 79
      },
      {
        "x": 197,
        "y": 85
      },
      {
        "x": 205,
        "y": 91
      },
      {
        "x": 211,
        "y": 98
      },
      {
        "x": 216,
        "y": 106
      },
      {
        "x": 221,
        "y": 114
      },
      {
        "x": 221,
        "y": 125
      },
      {
        "x": 226,
        "y": 136
      },
      {
        "x": 229,
        "y": 146
      },
      {
        "x": 230,
        "y": 156
      },
      {
        "x": 228,
        "y": 167
      },
      {
        "x": 222,
        "y": 177
      },
      {
        "x": 219,
        "y": 187
      },
      {
        "x": 214,
        "y": 196
      },
      {
        "x": 209,
        "y": 204
      },
      {
        "x": 204,
        "y": 212
      },
      {
        "x": 198,
        "y": 220
      },
      {
        "x": 189,
        "y": 230
      },
      {
        "x": 181,
        "y": 238
      },
      {
        "x": 174,
        "y": 245
      },
      {
        "x": 165,
        "y": 255
      },
      {
        "x": 158,
        "y": 262
      },
      {
        "x": 151,
        "y": 270
      },
      {
        "x": 147,
        "y": 281
      },
      {
        "x": 143,
        "y": 292
      },
      {
        "x": 141,
        "y": 302
      },
      {
        "x": 140,
        "y": 313
      },
      {
        "x": 140,
        "y": 324
      },
      {
        "x": 139,
        "y": 334
      },
      {
        "x": 139,
        "y": 345
      },
      {
        "x": 144,
        "y": 354
      },
      {
        "x": 149,
        "y": 368
      },
      {
        "x": 151,
        "y": 378
      },
      {
        "x": 156,
        "y": 387
      },
      {
        "x": 161,
        "y": 395
      },
      {
        "x": 170,
        "y": 402
      },
      {
        "x": 180,
        "y": 408
      },
      {
        "x": 189,
        "y": 411
      },
      {
        "x": 199,
        "y": 414
      },
      {
        "x": 209,
        "y": 416
      },
      {
        "x": 220,
        "y": 417
      },
      {
        "x": 229,
        "y": 419
      },
      {
        "x": 241,
        "y": 421
      },
      {
        "x": 250,
        "y": 422
      },
      {
        "x": 260,
        "y": 423
      },
      {
        "x": 270,
        "y": 423
      },
      {
        "x": 279,
        "y": 421
      },
      {
        "x": 287,
        "y": 416
      },
      {
        "x": 298,
        "y": 413
      },
      {
        "x": 307,
        "y": 409
      },
      {
        "x": 315,
        "y": 406
      },
      {
        "x": 327,
        "y": 403
      },
      {
        "x": 338,
        "y": 400
      },
      {
        "x": 347,
        "y": 398
      },
      {
        "x": 358,
        "y": 394
      },
      {
        "x": 368,
        "y": 391
      },
      {
        "x": 379,
        "y": 387
      },
      {
        "x": 387,
        "y": 383
      },
      {
        "x": 397,
        "y": 376
      },
      {
        "x": 405,
        "y": 371
      },
      {
        "x": 411,
        "y": 360
      },
      {
        "x": 419,
        "y": 351
      },
      {
        "x": 425,
        "y": 342
      },
      {
        "x": 431,
        "y": 333
      },
      {
        "x": 438,
        "y": 323
      },
      {
        "x": 444,
        "y": 312
      },
      {
        "x": 450,
        "y": 305
      },
      {
        "x": 458,
        "y": 297
      },
      {
        "x": 465,
        "y": 291
      },
      {
        "x": 475,
        "y": 283
      },
      {
        "x": 483,
        "y": 275
      },
      {
        "x": 491,
        "y": 266
      },
      {
        "x": 500,
        "y": 258
      },
      {
        "x": 507,
        "y": 253
      },
      {
        "x": 521,
        "y": 249
      },
      {
        "x": 531,
        "y": 248
      },
      {
        "x": 542,
        "y": 248
      },
      {
        "x": 551,
        "y": 248
      },
      {
        "x": 561,
        "y": 248
      },
      {
        "x": 574,
        "y": 250
      },
      {
        "x": 583,
        "y": 253
      },
      {
        "x": 595,
        "y": 256
      },
      {
        "x": 605,
        "y": 256
      },
      {
        "x": 616,
        "y": 254
      },
      {
        "x": 628,
        "y": 254
      },
      {
        "x": 637,
        "y": 256
      },
      {
        "x": 646,
        "y": 258
      },
      {
        "x": 656,
        "y": 259
      },
      {
        "x": 667,
        "y": 255
      },
      {
        "x": 676,
        "y": 254
      },
      {
        "x": 687,
        "y": 261
      },
      {
        "x": 693,
        "y": 270
      },
      {
        "x": 700,
        "y": 278
      },
      {
        "x": 707,
        "y": 287
      },
      {
        "x": 712,
        "y": 296
      },
      {
        "x": 717,
        "y": 305
      },
      {
        "x": 721,
        "y": 315
      },
      {
        "x": 724,
        "y": 328
      },
      {
        "x": 726,
        "y": 337
      },
      {
        "x": 726,
        "y": 349
      },
      {
        "x": 725,
        "y": 361
      },
      {
        "x": 728,
        "y": 372
      },
      {
        "x": 733,
        "y": 381
      },
      {
        "x": 738,
        "y": 389
      },
      {
        "x": 746,
        "y": 398
      },
      {
        "x": 755,
        "y": 401
      },
      {
        "x": 764,
        "y": 399
      },
      {
        "x": 774,
        "y": 395
      },
      {
        "x": 783,
        "y": 391
      },
      {
        "x": 790,
        "y": 385
      },
      {
        "x": 799,
        "y": 381
      },
      {
        "x": 807,
        "y": 376
      },
      {
        "x": 815,
        "y": 373
      },
      {
        "x": 827,
        "y": 369
      },
      {
        "x": 836,
        "y": 366
      },
      {
        "x": 846,
        "y": 364
      },
      {
        "x": 856,
        "y": 364
      },
      {
        "x": 866,
        "y": 367
      },
      {
        "x": 876,
        "y": 371
      },
      {
        "x": 888,
        "y": 376
      },
      {
        "x": 893,
        "y": 383
      },
      {
        "x": 901,
        "y": 393
      },
      {
        "x": 908,
        "y": 401
      },
      {
        "x": 916,
        "y": 407
      },
      {
        "x": 925,
        "y": 414
      },
      {
        "x": 935,
        "y": 420
      },
      {
        "x": 946,
        "y": 424
      },
      {
        "x": 958,
        "y": 425
      },
      {
        "x": 969,
        "y": 428
      },
      {
        "x": 979,
        "y": 433
      },
      {
        "x": 987,
        "y": 432
      },
      {
        "x": 998,
        "y": 427
      },
      {
        "x": 1000,
        "y": 423
      },
      {
        "x": 1000,
        "y": 418
      }
    ],
    "route2": [
      {
        "x": 218,
        "y": 587
      },
      {
        "x": 218,
        "y": 574
      },
      {
        "x": 218,
        "y": 564
      },
      {
        "x": 218,
        "y": 553
      },
      {
        "x": 220,
        "y": 539
      },
      {
        "x": 221,
        "y": 529
      },
      {
        "x": 221,
        "y": 517
      },
      {
        "x": 223,
        "y": 504
      },
      {
        "x": 223,
        "y": 493
      },
      {
        "x": 228,
        "y": 483
      },
      {
        "x": 235,
        "y": 475
      },
      {
        "x": 242,
        "y": 468
      },
      {
        "x": 248,
        "y": 461
      },
      {
        "x": 253,
        "y": 453
      },
      {
        "x": 261,
        "y": 446
      },
      {
        "x": 269,
        "y": 439
      },
      {
        "x": 276,
        "y": 432
      },
      {
        "x": 284,
        "y": 426
      },
      {
        "x": 292,
        "y": 421
      },
      {
        "x": 300,
        "y": 417
      },
      {
        "x": 310,
        "y": 413
      },
      {
        "x": 320,
        "y": 409
      },
      {
        "x": 330,
        "y": 406
      },
      {
        "x": 340,
        "y": 402
      },
      {
        "x": 350,
        "y": 402
      },
      {
        "x": 361,
        "y": 399
      },
      {
        "x": 371,
        "y": 396
      },
      {
        "x": 382,
        "y": 391
      },
      {
        "x": 393,
        "y": 384
      },
      {
        "x": 401,
        "y": 378
      },
      {
        "x": 408,
        "y": 370
      },
      {
        "x": 415,
        "y": 363
      },
      {
        "x": 421,
        "y": 356
      },
      {
        "x": 426,
        "y": 348
      },
      {
        "x": 432,
        "y": 339
      },
      {
        "x": 436,
        "y": 329
      },
      {
        "x": 442,
        "y": 321
      },
      {
        "x": 446,
        "y": 312
      },
      {
        "x": 451,
        "y": 304
      },
      {
        "x": 457,
        "y": 296
      },
      {
        "x": 463,
        "y": 285
      },
      {
        "x": 470,
        "y": 279
      },
      {
        "x": 477,
        "y": 273
      },
      {
        "x": 485,
        "y": 268
      },
      {
        "x": 494,
        "y": 259
      },
      {
        "x": 502,
        "y": 252
      },
      {
        "x": 511,
        "y": 248
      },
      {
        "x": 521,
        "y": 244
      },
      {
        "x": 530,
        "y": 243
      },
      {
        "x": 539,
        "y": 242
      },
      {
        "x": 548,
        "y": 241
      },
      {
        "x": 558,
        "y": 242
      },
      {
        "x": 566,
        "y": 244
      },
      {
        "x": 575,
        "y": 246
      },
      {
        "x": 586,
        "y": 247
      },
      {
        "x": 595,
        "y": 248
      },
      {
        "x": 603,
        "y": 253
      },
      {
        "x": 614,
        "y": 256
      },
      {
        "x": 623,
        "y": 260
      },
      {
        "x": 634,
        "y": 260
      },
      {
        "x": 643,
        "y": 260
      },
      {
        "x": 653,
        "y": 260
      },
      {
        "x": 663,
        "y": 261
      },
      {
        "x": 674,
        "y": 262
      },
      {
        "x": 685,
        "y": 266
      },
      {
        "x": 692,
        "y": 272
      },
      {
        "x": 700,
        "y": 280
      },
      {
        "x": 704,
        "y": 290
      },
      {
        "x": 710,
        "y": 300
      },
      {
        "x": 715,
        "y": 308
      },
      {
        "x": 717,
        "y": 318
      },
      {
        "x": 719,
        "y": 333
      },
      {
        "x": 721,
        "y": 343
      },
      {
        "x": 724,
        "y": 353
      },
      {
        "x": 726,
        "y": 362
      },
      {
        "x": 726,
        "y": 372
      },
      {
        "x": 731,
        "y": 382
      },
      {
        "x": 739,
        "y": 387
      },
      {
        "x": 748,
        "y": 391
      },
      {
        "x": 759,
        "y": 392
      },
      {
        "x": 770,
        "y": 390
      },
      {
        "x": 779,
        "y": 386
      },
      {
        "x": 789,
        "y": 381
      },
      {
        "x": 800,
        "y": 375
      },
      {
        "x": 813,
        "y": 372
      },
      {
        "x": 823,
        "y": 369
      },
      {
        "x": 834,
        "y": 366
      },
      {
        "x": 843,
        "y": 364
      },
      {
        "x": 854,
        "y": 362
      },
      {
        "x": 864,
        "y": 363
      },
      {
        "x": 873,
        "y": 368
      },
      {
        "x": 881,
        "y": 373
      },
      {
        "x": 888,
        "y": 380
      },
      {
        "x": 896,
        "y": 386
      },
      {
        "x": 904,
        "y": 391
      },
      {
        "x": 912,
        "y": 397
      },
      {
        "x": 923,
        "y": 402
      },
      {
        "x": 933,
        "y": 406
      },
      {
        "x": 942,
        "y": 414
      },
      {
        "x": 949,
        "y": 422
      },
      {
        "x": 957,
        "y": 426
      },
      {
        "x": 969,
        "y": 429
      },
      {
        "x": 980,
        "y": 429
      },
      {
        "x": 990,
        "y": 429
      },
      {
        "x": 999,
        "y": 428
      },
      {
        "x": 1000,
        "y": 427
      }
    ],
    "route3": [
      {
        "x": 440,
        "y": 589
      },
      {
        "x": 440,
        "y": 562
      },
      {
        "x": 439,
        "y": 553
      },
      {
        "x": 439,
        "y": 543
      },
      {
        "x": 436,
        "y": 529
      },
      {
        "x": 433,
        "y": 518
      },
      {
        "x": 430,
        "y": 506
      },
      {
        "x": 428,
        "y": 496
      },
      {
        "x": 428,
        "y": 484
      },
      {
        "x": 426,
        "y": 475
      },
      {
        "x": 424,
        "y": 464
      },
      {
        "x": 423,
        "y": 454
      },
      {
        "x": 421,
        "y": 442
      },
      {
        "x": 418,
        "y": 432
      },
      {
        "x": 415,
        "y": 421
      },
      {
        "x": 415,
        "y": 412
      },
      {
        "x": 415,
        "y": 399
      },
      {
        "x": 414,
        "y": 390
      },
      {
        "x": 414,
        "y": 380
      },
      {
        "x": 414,
        "y": 370
      },
      {
        "x": 416,
        "y": 358
      },
      {
        "x": 422,
        "y": 347
      },
      {
        "x": 427,
        "y": 338
      },
      {
        "x": 433,
        "y": 331
      },
      {
        "x": 440,
        "y": 321
      },
      {
        "x": 447,
        "y": 311
      },
      {
        "x": 456,
        "y": 302
      },
      {
        "x": 463,
        "y": 296
      },
      {
        "x": 470,
        "y": 289
      },
      {
        "x": 475,
        "y": 281
      },
      {
        "x": 483,
        "y": 272
      },
      {
        "x": 490,
        "y": 265
      },
      {
        "x": 500,
        "y": 259
      },
      {
        "x": 508,
        "y": 255
      },
      {
        "x": 518,
        "y": 252
      },
      {
        "x": 527,
        "y": 248
      },
      {
        "x": 535,
        "y": 245
      },
      {
        "x": 546,
        "y": 243
      },
      {
        "x": 557,
        "y": 243
      },
      {
        "x": 567,
        "y": 243
      },
      {
        "x": 577,
        "y": 243
      },
      {
        "x": 590,
        "y": 246
      },
      {
        "x": 600,
        "y": 248
      },
      {
        "x": 609,
        "y": 251
      },
      {
        "x": 619,
        "y": 255
      },
      {
        "x": 628,
        "y": 258
      },
      {
        "x": 639,
        "y": 262
      },
      {
        "x": 649,
        "y": 264
      },
      {
        "x": 659,
        "y": 266
      },
      {
        "x": 668,
        "y": 269
      },
      {
        "x": 677,
        "y": 271
      },
      {
        "x": 687,
        "y": 272
      },
      {
        "x": 696,
        "y": 278
      },
      {
        "x": 702,
        "y": 289
      },
      {
        "x": 707,
        "y": 298
      },
      {
        "x": 715,
        "y": 307
      },
      {
        "x": 720,
        "y": 317
      },
      {
        "x": 726,
        "y": 327
      },
      {
        "x": 727,
        "y": 338
      },
      {
        "x": 728,
        "y": 349
      },
      {
        "x": 730,
        "y": 360
      },
      {
        "x": 735,
        "y": 370
      },
      {
        "x": 741,
        "y": 379
      },
      {
        "x": 749,
        "y": 385
      },
      {
        "x": 759,
        "y": 389
      },
      {
        "x": 768,
        "y": 389
      },
      {
        "x": 777,
        "y": 387
      },
      {
        "x": 788,
        "y": 385
      },
      {
        "x": 799,
        "y": 383
      },
      {
        "x": 808,
        "y": 381
      },
      {
        "x": 820,
        "y": 375
      },
      {
        "x": 831,
        "y": 373
      },
      {
        "x": 841,
        "y": 372
      },
      {
        "x": 853,
        "y": 369
      },
      {
        "x": 863,
        "y": 368
      },
      {
        "x": 875,
        "y": 370
      },
      {
        "x": 885,
        "y": 375
      },
      {
        "x": 893,
        "y": 379
      },
      {
        "x": 903,
        "y": 383
      },
      {
        "x": 912,
        "y": 387
      },
      {
        "x": 919,
        "y": 394
      },
      {
        "x": 927,
        "y": 401
      },
      {
        "x": 935,
        "y": 407
      },
      {
        "x": 945,
        "y": 412
      },
      {
        "x": 953,
        "y": 418
      },
      {
        "x": 960,
        "y": 424
      },
      {
        "x": 971,
        "y": 427
      },
      {
        "x": 980,
        "y": 425
      },
      {
        "x": 989,
        "y": 422
      },
      {
        "x": 999,
        "y": 419
      },
      {
        "x": 1000,
        "y": 420
      },
      {
        "x": 1000,
        "y": 420
      }
    ],
    "route4": [
      {
        "x": 592,
        "y": 0
      },
      {
        "x": 600,
        "y": 7
      },
      {
        "x": 607,
        "y": 15
      },
      {
        "x": 615,
        "y": 22
      },
      {
        "x": 623,
        "y": 28
      },
      {
        "x": 632,
        "y": 36
      },
      {
        "x": 641,
        "y": 45
      },
      {
        "x": 649,
        "y": 53
      },
      {
        "x": 659,
        "y": 62
      },
      {
        "x": 667,
        "y": 68
      },
      {
        "x": 675,
        "y": 72
      },
      {
        "x": 683,
        "y": 80
      },
      {
        "x": 687,
        "y": 91
      },
      {
        "x": 694,
        "y": 102
      },
      {
        "x": 700,
        "y": 113
      },
      {
        "x": 705,
        "y": 126
      },
      {
        "x": 710,
        "y": 136
      },
      {
        "x": 717,
        "y": 144
      },
      {
        "x": 720,
        "y": 153
      },
      {
        "x": 720,
        "y": 167
      },
      {
        "x": 718,
        "y": 178
      },
      {
        "x": 717,
        "y": 191
      },
      {
        "x": 716,
        "y": 202
      },
      {
        "x": 714,
        "y": 213
      },
      {
        "x": 712,
        "y": 224
      },
      {
        "x": 710,
        "y": 234
      },
      {
        "x": 709,
        "y": 247
      },
      {
        "x": 709,
        "y": 258
      },
      {
        "x": 709,
        "y": 270
      },
      {
        "x": 711,
        "y": 280
      },
      {
        "x": 711,
        "y": 292
      },
      {
        "x": 712,
        "y": 303
      },
      {
        "x": 714,
        "y": 313
      },
      {
        "x": 717,
        "y": 324
      },
      {
        "x": 720,
        "y": 333
      },
      {
        "x": 726,
        "y": 345
      },
      {
        "x": 731,
        "y": 355
      },
      {
        "x": 734,
        "y": 365
      },
      {
        "x": 737,
        "y": 374
      },
      {
        "x": 741,
        "y": 384
      },
      {
        "x": 748,
        "y": 394
      },
      {
        "x": 756,
        "y": 398
      },
      {
        "x": 768,
        "y": 399
      },
      {
        "x": 778,
        "y": 396
      },
      {
        "x": 789,
        "y": 392
      },
      {
        "x": 799,
        "y": 385
      },
      {
        "x": 807,
        "y": 380
      },
      {
        "x": 816,
        "y": 375
      },
      {
        "x": 825,
        "y": 370
      },
      {
        "x": 834,
        "y": 367
      },
      {
        "x": 847,
        "y": 366
      },
      {
        "x": 857,
        "y": 366
      },
      {
        "x": 867,
        "y": 366
      },
      {
        "x": 879,
        "y": 369
      },
      {
        "x": 888,
        "y": 373
      },
      {
        "x": 896,
        "y": 378
      },
      {
        "x": 904,
        "y": 385
      },
      {
        "x": 911,
        "y": 391
      },
      {
        "x": 920,
        "y": 400
      },
      {
        "x": 928,
        "y": 406
      },
      {
        "x": 936,
        "y": 412
      },
      {
        "x": 948,
        "y": 417
      },
      {
        "x": 960,
        "y": 420
      },
      {
        "x": 970,
        "y": 423
      },
      {
        "x": 981,
        "y": 425
      },
      {
        "x": 992,
        "y": 425
      },
      {
        "x": 1000,
        "y": 424
      },
      {
        "x": 1000,
        "y": 421
      }
    ]
  };

  const ROUTE_KEYS = Object.keys(ROUTES);
  const PLANE_LANES = {
    top: 94,
    middle: 168,
    bottom: 244,
  };

  const TYPE_STYLE = {
    soldier: { scale: 1.2, cls: 'sim-soldier' },
    grenadier: { scale: 1.2, cls: 'sim-grenadier' },
    tank: { scale: 0.52, cls: 'sim-tank' },
    humvee: { scale: 0.4, cls: 'sim-humvee' },
    plane: { scale: 0.68, cls: 'sim-plane' },
  };

  const BOARD_WIDTH = 1600;
  const BOARD_HEIGHT = 900;
  const NORMAL_DIFFICULTY_SPEED_MULT = 0.94;
  const BOARD_TO_SIM_DISTANCE_SCALE = (
    (WORLD_BOUNDS.width / BOARD_WIDTH)
    + (WORLD_BOUNDS.height / BOARD_HEIGHT)
  ) * 0.5;
  const WAVE1_SPEED_BASE = (170 + 12) * 0.88 * NORMAL_DIFFICULTY_SPEED_MULT * BOARD_TO_SIM_DISTANCE_SCALE;
  const SPEED_SCALE_BY_TYPE = {
    soldier: 0.26,
    grenadier: 0.25,
    tank: 0.30,
    humvee: 0.30,
  };
  const PLANE_VARIANTS_WAVE1 = [
    { cls: 'variant-scout', speedScale: 0.46 },
    { cls: 'variant-hawk', speedScale: 0.50 },
    { cls: 'variant-stuka', speedScale: 0.44 },
  ];

  let routeCursor = 0;
  let waveNumber = 1;
  let worldIndex = 0;
  let spawnPlan = [];
  let spawnPlanIndex = 0;
  let nextSpawnAt = 0;
  let planeVariantIndex = 0;
  let units = [];
  let lastSpawnMetaByRoute = {};
  let routeCache = {};
  let surge = {
    active: false,
    branch: null,
    remaining: 0,
  };

  const layoutRules = {
    tankForcedRouteKey: null,
    eliteSoldierForcedRouteKey: null,
  };

  const getMapProjection = () => {
    const heroW = Math.max(1, hero.clientWidth);
    const heroH = Math.max(1, hero.clientHeight);
    const sx = heroW / WORLD_BOUNDS.width;
    const sy = heroH / WORLD_BOUNDS.height;
    const scale = Math.max(sx, sy);
    const drawW = WORLD_BOUNDS.width * scale;
    const drawH = WORLD_BOUNDS.height * scale;
    return {
      scale,
      offsetX: (heroW - drawW) * 0.5,
      offsetY: (heroH - drawH) * 0.5,
    };
  };

  const toPx = (point) => {
    const projection = getMapProjection();
    return {
      x: projection.offsetX + (point.x * projection.scale),
      y: projection.offsetY + (point.y * projection.scale),
    };
  };

  const buildSegments = (path) => {
    const segments = [];
    for (let i = 0; i < path.length - 1; i += 1) {
      const start = path[i];
      const end = path[i + 1];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy);
      if (!length) {
        continue;
      }
      segments.push({
        start,
        end,
        length,
        ux: dx / length,
        uy: dy / length,
        angle: Math.atan2(dy, dx),
      });
    }
    return segments;
  };

  const getSpawnViewportRect = () => {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    const leftInset = w * 0.08;
    const rightInset = w * 0.08;
    const topInset = h * 0.2;
    const bottomInset = h * 0.14;
    return {
      x: leftInset,
      y: topInset,
      width: Math.max(1, w - leftInset - rightInset),
      height: Math.max(1, h - topInset - bottomInset),
    };
  };

  const contains = (rect, x, y) => (
    x >= rect.x
    && x <= rect.x + rect.width
    && y >= rect.y
    && y <= rect.y + rect.height
  );

  const clipSegmentToRect = (start, end, rect) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    let t0 = 0;
    let t1 = 1;

    const clip = (p, q) => {
      if (p === 0) {
        return q >= 0;
      }
      const ratio = q / p;
      if (p < 0) {
        if (ratio > t1) return false;
        if (ratio > t0) t0 = ratio;
      } else {
        if (ratio < t0) return false;
        if (ratio < t1) t1 = ratio;
      }
      return true;
    };

    if (!clip(-dx, start.x - rect.x)) return null;
    if (!clip(dx, (rect.x + rect.width) - start.x)) return null;
    if (!clip(-dy, start.y - rect.y)) return null;
    if (!clip(dy, (rect.y + rect.height) - start.y)) return null;
    return { tEnter: t0, tExit: t1 };
  };

  const getViewportSpawnStateForRoute = (routePath, routeSegments) => {
    if (!routePath.length || !routeSegments.length) {
      return null;
    }

    const rect = getSpawnViewportRect();
    const firstPoint = routePath[0];
    if (contains(rect, firstPoint.x, firstPoint.y)) {
      const firstSegment = routeSegments[0];
      if (firstSegment) {
        const rayLength = Math.max(hero.clientWidth, hero.clientHeight) * 2;
        const projectedStart = {
          x: firstSegment.start.x - (firstSegment.ux * rayLength),
          y: firstSegment.start.y - (firstSegment.uy * rayLength),
        };
        const clipped = clipSegmentToRect(projectedStart, firstSegment.start, rect);
        if (clipped) {
          const dx = firstSegment.start.x - projectedStart.x;
          const dy = firstSegment.start.y - projectedStart.y;
          const t = Math.max(0, Math.min(1, clipped.tEnter));
          const spawnX = projectedStart.x + (dx * t);
          const spawnY = projectedStart.y + (dy * t);
          const spawnDistance = Math.hypot(firstSegment.start.x - spawnX, firstSegment.start.y - spawnY);
          return {
            x: spawnX,
            y: spawnY,
            pathIndex: 0,
            segmentDistance: -Math.max(0, spawnDistance),
          };
        }
      }
      return {
        x: firstPoint.x,
        y: firstPoint.y,
        pathIndex: 0,
        segmentDistance: 0,
      };
    }

    for (let index = 0; index < routeSegments.length; index += 1) {
      const seg = routeSegments[index];
      const clipped = clipSegmentToRect(seg.start, seg.end, rect);
      if (!clipped) {
        continue;
      }
      const t = Math.max(0, Math.min(1, clipped.tEnter));
      return {
        x: seg.start.x + ((seg.end.x - seg.start.x) * t),
        y: seg.start.y + ((seg.end.y - seg.start.y) * t),
        pathIndex: index,
        segmentDistance: seg.length * t,
      };
    }

    return {
      x: routePath[0].x,
      y: routePath[0].y,
      pathIndex: 0,
      segmentDistance: 0,
    };
  };

  const routeAt = (index) => ROUTE_KEYS[index % Math.max(1, ROUTE_KEYS.length)] || 'route1';

  const allocRouteSpan = (spanSize) => {
    const safeSpan = Math.max(1, Number(spanSize) || 1);
    const start = routeCursor;
    routeCursor = (routeCursor + safeSpan) % ROUTE_KEYS.length;
    return start;
  };

  const routeKeyFromSpan = (spanStart, index = 0) => {
    const safeIndex = Math.max(0, Number(index) || 0);
    return ROUTE_KEYS[(spanStart + safeIndex) % ROUTE_KEYS.length] || 'route1';
  };

  const pushUnitGroup = (plan, enemyType, count, intraDelay, intraDistance, preUnitDistance, getExtraStepData = null) => {
    for (let unitIndex = 0; unitIndex < count; unitIndex += 1) {
      const isFirstOverall = plan.length === 0;
      const extraStepData = typeof getExtraStepData === 'function'
        ? (getExtraStepData(unitIndex, count) || {})
        : (getExtraStepData || {});
      plan.push({
        enemyType,
        delayAfter: intraDelay,
        minGapFromPrev: isFirstOverall ? 0 : (unitIndex === 0 ? preUnitDistance : intraDistance),
        ...extraStepData,
      });
    }
  };

  const setLastDelay = (plan, delayAfter) => {
    if (!plan.length) {
      return;
    }
    plan[plan.length - 1].delayAfter = delayAfter;
  };

  const pushParallelRoutePressurePulse = (plan, enemyType = 'soldier', spawnBatchIntraGap = 168) => {
    if (ROUTE_KEYS.length <= 1) {
      return;
    }
    const pulseRoutes = ROUTE_KEYS.slice(0, Math.min(4, ROUTE_KEYS.length));
    pulseRoutes.forEach((routeKey, idx) => {
      plan.push({
        enemyType,
        forcedRouteKey: routeKey,
        minGapFromPrev: 0,
        delayAfter: idx < pulseRoutes.length - 1 ? 0 : Math.max(70, Math.round(spawnBatchIntraGap * 0.62)),
      });
    });
  };

  const getAlternatingRouteOrder = () => {
    const ordered = [];
    for (let idx = 0; idx < ROUTE_KEYS.length; idx += 2) {
      ordered.push(ROUTE_KEYS[idx]);
    }
    for (let idx = 1; idx < ROUTE_KEYS.length; idx += 2) {
      ordered.push(ROUTE_KEYS[idx]);
    }
    return ordered;
  };

  const buildWorld1Wave1Plan = () => {
    const plan = [];

    // Match wave-1 spawn gap math in game-wave-system.
    const spawnBatchIntraGap = 168;
    const spawnTankIntraGap = 144;
    const spawnTankToSoldierGap = 920;
    const spawnSoldierToTankGap = 1000;
    const dynamicCadenceMs = Math.max(90, Math.round(spawnBatchIntraGap * 0.9));
    const dynamicWindowGapMs = Math.max(360, Math.round(spawnTankToSoldierGap * 0.72));
    const dynamicHeavyGapMs = Math.max(520, Math.round(spawnSoldierToTankGap * 0.85));

    if (ROUTE_KEYS.length > 1) {
      const openerType = waveNumber >= 4 ? 'raider' : 'soldier';
      const orderedRoutes = getAlternatingRouteOrder();
      orderedRoutes.forEach((routeKey, idx) => {
        plan.push({
          enemyType: openerType,
          forcedRouteKey: routeKey,
          minGapFromPrev: 0,
          delayAfter: idx < orderedRoutes.length - 1 ? 0 : Math.max(95, Math.round(spawnBatchIntraGap * 0.68)),
        });
      });
    }

    pushUnitGroup(
      plan,
      'plane',
      4,
      Math.max(140, spawnTankIntraGap + 60),
      104,
      90,
      (unitIndex) => ({
        forcedRouteKey: routeAt(unitIndex),
        planeLane: ['top', 'middle', 'bottom', 'middle'][unitIndex % 4],
        planeDirection: 'east',
      })
    );
    setLastDelay(plan, Math.max(180, dynamicHeavyGapMs));

    const openingSoldierCount = 3;
    const openingSoldierRouteSpan = allocRouteSpan(openingSoldierCount);
    pushUnitGroup(
      plan,
      'soldier',
      openingSoldierCount,
      dynamicCadenceMs,
      102,
      150,
      (unitIndex) => ({ forcedRouteKey: routeKeyFromSpan(openingSoldierRouteSpan, unitIndex) })
    );
    setLastDelay(plan, dynamicHeavyGapMs);

    const openingTankCount = 2;
    const openingTankRouteSpan = allocRouteSpan(openingTankCount);
    pushUnitGroup(
      plan,
      'tank',
      openingTankCount,
      Math.max(dynamicHeavyGapMs, spawnTankIntraGap + 40),
      100,
      102,
      (unitIndex) => ({ forcedRouteKey: routeKeyFromSpan(openingTankRouteSpan, unitIndex) })
    );
    setLastDelay(plan, dynamicWindowGapMs);

    const openingHumveeCount = 2;
    const openingHumveeRouteSpan = allocRouteSpan(openingHumveeCount);
    pushUnitGroup(
      plan,
      'humvee',
      openingHumveeCount,
      Math.max(dynamicCadenceMs + 70, spawnBatchIntraGap + 60),
      126,
      172,
      (unitIndex) => ({ forcedRouteKey: routeKeyFromSpan(openingHumveeRouteSpan, unitIndex) })
    );
    setLastDelay(plan, Math.max(420, dynamicWindowGapMs + 90));

    const openingGrenadierCount = 1;
    const openingGrenadierRouteSpan = allocRouteSpan(openingGrenadierCount);
    pushUnitGroup(
      plan,
      'grenadier',
      openingGrenadierCount,
      Math.max(dynamicCadenceMs, spawnBatchIntraGap),
      104,
      82,
      (unitIndex) => ({ forcedRouteKey: routeKeyFromSpan(openingGrenadierRouteSpan, unitIndex) })
    );
    setLastDelay(plan, 9000);

    pushUnitGroup(
      plan,
      'plane',
      3,
      Math.max(140, spawnTankIntraGap + 60),
      104,
      150,
      (unitIndex) => ({
        forcedRouteKey: routeAt(unitIndex + 1),
        planeLane: ['bottom', 'top', 'middle'][unitIndex % 3],
        planeDirection: 'east',
      })
    );
    setLastDelay(plan, dynamicWindowGapMs);

    pushParallelRoutePressurePulse(plan, 'soldier', spawnBatchIntraGap);
    setLastDelay(plan, Math.max(120, dynamicCadenceMs));

    pushUnitGroup(
      plan,
      'soldier',
      2,
      dynamicCadenceMs,
      102,
      150,
      { forcedRouteKey: 'route1' }
    );
    setLastDelay(plan, 10000);

    const lateReinforcementRouteSpan = allocRouteSpan(2);
    pushUnitGroup(
      plan,
      'soldier',
      2,
      spawnBatchIntraGap,
      104,
      150,
      (unitIndex) => ({
        forcedRouteKey: routeKeyFromSpan(lateReinforcementRouteSpan, unitIndex),
        isBarrage: unitIndex < 2,
        barrageTag: unitIndex < 2 ? 'w1w1-lightning-window' : null,
      })
    );

    pushUnitGroup(
      plan,
      'plane',
      2,
      Math.max(140, spawnTankIntraGap + 60),
      104,
      104,
      (unitIndex) => ({
        forcedRouteKey: routeAt(unitIndex),
        planeLane: ['top', 'bottom'][unitIndex % 2],
        planeDirection: 'east',
      })
    );
    setLastDelay(plan, dynamicWindowGapMs);

    return plan;
  };

  const getDistanceAlongPath = (unit) => {
    let dist = 0;
    const segs = unit.segments;
    for (let i = 0; i < unit.pathIndex; i += 1) {
      dist += segs[i]?.length || 0;
    }
    dist += Math.max(0, unit.segmentDistance || 0);
    return dist;
  };

  const triggerBarrageFlag = () => {
    if (!barrageFlag) {
      return;
    }
    barrageFlag.classList.add('active');
    window.setTimeout(() => barrageFlag.classList.remove('active'), 1900);
  };

  const resolveRouteKeyForStep = (step, enemyType) => {
    const forcedRouteFromLayout = enemyType === 'tank'
      ? layoutRules.tankForcedRouteKey
      : (enemyType === 'eliteSoldier' ? layoutRules.eliteSoldierForcedRouteKey : null);
    const forcedRouteKey = step?.forcedRouteKey || forcedRouteFromLayout;
    if (forcedRouteKey && ROUTE_KEYS.includes(forcedRouteKey)) {
      return forcedRouteKey;
    }

    const routePool = ROUTE_KEYS.slice();
    const routeKey = routePool[routeCursor % routePool.length] || 'route1';
    routeCursor += 1;
    return routeKey;
  };

  const canSpawnStep = (step, routeKey, now) => {
    const enemyType = String(step?.enemyType || 'soldier');
    const queuedArmored = enemyType === 'tank' || enemyType === 'humvee';
    const routeLastSpawnMeta = lastSpawnMetaByRoute[routeKey] || null;
    const previousEnemyType = String(routeLastSpawnMeta?.enemyType || '');
    const previousWasArmored = previousEnemyType === 'tank' || previousEnemyType === 'humvee';
    const baseMovementGate = queuedArmored ? 96 : 28;
    const vehiclePairGate = (queuedArmored && previousWasArmored) ? 138 : 0;
    const requiredGap = Math.max(Number(step?.minGapFromPrev || 0), baseMovementGate, vehiclePairGate);

    if (requiredGap > 0 && routeLastSpawnMeta) {
      let traveled = 0;
      if (routeLastSpawnMeta.unit && routeLastSpawnMeta.unit.active) {
        traveled = getDistanceAlongPath(routeLastSpawnMeta.unit);
      } else {
        traveled = ((now - routeLastSpawnMeta.spawnTime) / 1000) * (routeLastSpawnMeta.speed || 0);
      }
      if (traveled < requiredGap) {
        return false;
      }
    }

    if (queuedArmored) {
      const minArmoredRouteHeadway = enemyType === 'tank' ? 128 : 112;
      let closestArmoredAheadDistance = Number.POSITIVE_INFINITY;
      units.forEach((unit) => {
        if (!unit.active || unit.isPlane || unit.routeKey !== routeKey) {
          return;
        }
        if (unit.enemyType !== 'tank' && unit.enemyType !== 'humvee') {
          return;
        }
        const d = getDistanceAlongPath(unit);
        if (d < closestArmoredAheadDistance) {
          closestArmoredAheadDistance = d;
        }
      });
      if (closestArmoredAheadDistance < minArmoredRouteHeadway) {
        return false;
      }
    }

    return true;
  };

  const createUnitElement = (enemyType, planeVariantClass = null) => {
    const el = document.createElement('div');
    const cls = TYPE_STYLE[enemyType]?.cls || TYPE_STYLE.soldier.cls;
    el.className = `sim-unit ${cls}`;
    if (enemyType === 'plane' && planeVariantClass) {
      el.classList.add(planeVariantClass);
    }
    unitLayer.appendChild(el);
    return el;
  };

  const getBaseSpeedForType = (enemyType) => {
    const speedScale = SPEED_SCALE_BY_TYPE[enemyType] || SPEED_SCALE_BY_TYPE.soldier;
    return WAVE1_SPEED_BASE * speedScale;
  };

  const spawnEnemy = (enemyType, step, routeKey, now) => {
    const style = TYPE_STYLE[enemyType] || TYPE_STYLE.soldier;
    const planeVariant = enemyType === 'plane'
      ? PLANE_VARIANTS_WAVE1[planeVariantIndex % PLANE_VARIANTS_WAVE1.length]
      : null;
    if (enemyType === 'plane') {
      planeVariantIndex += 1;
    }
    const el = createUnitElement(enemyType, planeVariant?.cls || null);

    let unit;
    if (enemyType === 'plane') {
      const laneName = step?.planeLane || 'middle';
      const laneY = ((PLANE_LANES[laneName] || PLANE_LANES.middle) / WORLD_BOUNDS.height) * hero.clientHeight;
      const direction = step?.planeDirection === 'west' ? -1 : 1;
      const spawnX = direction > 0 ? -120 : hero.clientWidth + 120;
      unit = {
        active: true,
        isPlane: true,
        enemyType,
        routeKey,
        el,
        x: spawnX,
        y: laneY,
        speed: WAVE1_SPEED_BASE * (planeVariant?.speedScale || 0.46),
        direction,
        wobbleSeed: Math.random() * Math.PI * 2,
        scale: style.scale,
      };
      units.push(unit);
      return unit;
    }

    const routeData = routeCache[routeKey];
    unit = {
      active: true,
      isPlane: false,
      enemyType,
      routeKey,
      el,
      path: routeData.path,
      segments: routeData.segments,
      pathIndex: 0,
      segmentDistance: 0,
      x: routeData.path[0].x,
      y: routeData.path[0].y,
      speed: getBaseSpeedForType(enemyType),
      scale: style.scale,
    };
    units.push(unit);
    return unit;
  };

  const removeUnit = (unit) => {
    unit.active = false;
    unit.el.remove();
  };

  const updateGroundUnit = (unit, dt) => {
    let travelLeft = unit.speed * dt;
    while (travelLeft > 0) {
      const seg = unit.segments[unit.pathIndex];
      if (!seg) {
        removeUnit(unit);
        return;
      }

      if (unit.segmentDistance < 0) {
        const enterDistance = Math.min(travelLeft, -unit.segmentDistance);
        unit.segmentDistance += enterDistance;
        travelLeft -= enterDistance;
      } else {
        const distanceToEnd = seg.length - unit.segmentDistance;
        if (travelLeft < distanceToEnd) {
          unit.segmentDistance += travelLeft;
          travelLeft = 0;
        } else {
          travelLeft -= distanceToEnd;
          unit.pathIndex += 1;
          unit.segmentDistance = 0;
          if (unit.pathIndex >= unit.segments.length) {
            removeUnit(unit);
            return;
          }
        }
      }
    }

    const seg = unit.segments[unit.pathIndex];
    if (!seg) {
      removeUnit(unit);
      return;
    }

    unit.x = seg.start.x + (seg.ux * unit.segmentDistance);
    unit.y = seg.start.y + (seg.uy * unit.segmentDistance);

    const isSoldierType = unit.enemyType === 'soldier' || unit.enemyType === 'grenadier';
    const rise = unit.enemyType === 'tank' ? -1 : (unit.enemyType === 'humvee' ? -2 : -3);
    let rotation = seg.angle;
    let scaleX = unit.scale;
    const scaleY = unit.scale;
    if (isSoldierType) {
      rotation = 0;
      scaleX = seg.ux >= 0 ? unit.scale : -unit.scale;
    } else if (unit.enemyType === 'humvee') {
      rotation = seg.angle + Math.PI;
    } else if (unit.enemyType === 'tank') {
      rotation = seg.angle + (Math.PI / 2);
    }
    const alpha = unit.segmentDistance < 10 ? Math.min(1, Math.max(0.15, (unit.segmentDistance + 18) / 28)) : 1;
    unit.el.style.opacity = String(alpha);
    unit.el.style.transform = `translate(${unit.x}px, ${unit.y + rise}px) translate(-50%, -50%) scale(${scaleX}, ${scaleY}) rotate(${rotation}rad)`;
  };

  const updatePlaneUnit = (unit, dt, now) => {
    unit.x += unit.speed * dt * unit.direction;
    unit.y += Math.sin((now * 0.0026) + unit.wobbleSeed) * 0.55;

    const inBounds = unit.x > -200 && unit.x < hero.clientWidth + 200;
    if (!inBounds) {
      removeUnit(unit);
      return;
    }

    const rot = unit.direction > 0 ? (Math.PI / 2) : (-(Math.PI / 2));
    unit.el.style.opacity = '0.9';
    unit.el.style.transform = `translate(${unit.x}px, ${unit.y}px) translate(-50%, -50%) scale(${unit.scale}) rotate(${rot}rad)`;
  };

  const advanceSpawns = (now) => {
    let iterations = 10;
    while (spawnPlanIndex < spawnPlan.length && now >= nextSpawnAt && iterations > 0) {
      let selectedSpawnIndex = spawnPlanIndex;
      let step = spawnPlan[selectedSpawnIndex];
      let routeKey = resolveRouteKeyForStep(step, step.enemyType);
      let canSpawn = canSpawnStep(step, routeKey, now);

      if (!canSpawn && spawnPlan.length > (spawnPlanIndex + 1)) {
        const blockedRoute = routeKey;
        const maxProbeIndex = Math.min(spawnPlan.length - 1, spawnPlanIndex + 24);
        for (let probeIndex = spawnPlanIndex + 1; probeIndex <= maxProbeIndex; probeIndex += 1) {
          const candidateStep = spawnPlan[probeIndex];
          if (!candidateStep) {
            continue;
          }
          const candidateRouteKey = resolveRouteKeyForStep(candidateStep, candidateStep.enemyType);
          if (candidateRouteKey === blockedRoute) {
            continue;
          }
          const candidateCanSpawn = canSpawnStep(candidateStep, candidateRouteKey, now);
          if (!candidateCanSpawn) {
            continue;
          }
          selectedSpawnIndex = probeIndex;
          step = candidateStep;
          routeKey = candidateRouteKey;
          canSpawn = true;
          break;
        }
      }

      if (!canSpawn) {
        nextSpawnAt = now + 16;
        break;
      }

      if (selectedSpawnIndex !== spawnPlanIndex) {
        const selectedStep = spawnPlan[selectedSpawnIndex];
        spawnPlan.splice(selectedSpawnIndex, 1);
        spawnPlan.splice(spawnPlanIndex, 0, selectedStep);
        step = selectedStep;
      }

      const activeGroundCount = units.filter((u) => u.active && !u.isPlane).length;
      const spawnCap = 10 + Math.floor((waveNumber || 1) * 0.9);
      if (activeGroundCount >= spawnCap && step.enemyType !== 'plane') {
        nextSpawnAt = now + 600;
        break;
      }

      const spawned = spawnEnemy(step.enemyType, step, routeKey, now);
      if (step.isBarrage && step.barrageTag) {
        triggerBarrageFlag();
      }

      lastSpawnMetaByRoute[routeKey] = {
        unit: spawned,
        spawnTime: now,
        speed: spawned?.speed || 0,
        enemyType: step.enemyType,
        routeKey,
      };

      spawnPlanIndex += 1;
      nextSpawnAt = now + Math.max(0, Number(step.delayAfter ?? 120));
      iterations -= 1;
    }

    if (spawnPlanIndex >= spawnPlan.length && units.every((u) => !u.active)) {
      resetRuntime(now + 2200);
    }
  };

  const drawRoutes = () => {
    routeOverlay.innerHTML = '';
    ROUTE_KEYS.forEach((routeKey, idx) => {
      const path = ROUTES[routeKey];
      const d = path.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', d);
      p.setAttribute('class', idx === 0 ? 'route-main' : 'route-branch');
      routeOverlay.appendChild(p);
    });
  };

  const cacheRoutes = () => {
    ROUTE_KEYS.forEach((routeKey) => {
      const path = ROUTES[routeKey].map(toPx);
      routeCache[routeKey] = {
        path,
        segments: buildSegments(path),
      };
    });

    const spawnPoint = routeCache.route1?.path?.[0];
    if (spawnPoint) {
      lane.style.setProperty('--spawn-x', `${spawnPoint.x}px`);
      lane.style.setProperty('--spawn-y', `${spawnPoint.y}px`);
    }
  };

  const resetRuntime = (startAt = performance.now() + 600) => {
    units.forEach((unit) => unit.el.remove());
    units = [];
    routeCursor = (waveNumber + worldIndex) % ROUTE_KEYS.length;
    planeVariantIndex = 0;
    surge = { active: false, branch: null, remaining: 0 };
    lastSpawnMetaByRoute = {};
    spawnPlan = buildWorld1Wave1Plan();
    spawnPlanIndex = 0;
    nextSpawnAt = startAt;
  };

  const onResize = () => {
    cacheRoutes();
  };

  let previousNow = performance.now();
  const tick = (now) => {
    const dt = Math.min(0.05, (now - previousNow) / 1000);
    previousNow = now;

    advanceSpawns(now);

    units.forEach((unit) => {
      if (!unit.active) {
        return;
      }
      if (unit.isPlane) {
        updatePlaneUnit(unit, dt, now);
      } else {
        updateGroundUnit(unit, dt);
      }
    });

    units = units.filter((unit) => unit.active);
    requestAnimationFrame(tick);
  };

  drawRoutes();
  cacheRoutes();
  resetRuntime();

  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(hero);
  window.addEventListener('resize', onResize);

  requestAnimationFrame(tick);
})();
