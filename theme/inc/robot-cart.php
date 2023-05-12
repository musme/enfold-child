<div class="overflow-hidden rounded-lg border border-solid shadow-lg">
  <div class="group relative flex max-h-[300px] min-h-[300px] w-full items-center justify-center border-b border-solid bg-gradient-to-b from-slate-300 to-slate-50">
    <a href="<?php echo $robot['link'];?>" class="absolute inset-0"></a>
    <div class="overflow-hidden" >
      <img
        src="<?php echo $robot['image'];?>"
        alt="<?php echo $robot['title'];?>"
        class="pointer-events-none max-h-[300px] max-w-[300px] scale-100 duration-500 group-hover:scale-110"
      />
    </div>
    <?php if(!empty($robot['skills'])):?>
    <div class='robot-skills-popover' data-skills='<?php echo $robot['skills']?>'></div>
    <?php endif;?>
    <a
      href="<?php echo $robot['link'];?>"
      class="hover:bg-secondary absolute -bottom-6 right-5 flex items-center justify-center rounded-full border border-solid bg-white p-2 shadow-lg lg:p-3"
      target="_blank"
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 320 512"
        height="2em"
        width="2em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
      </svg>
    </a>
  </div>
  <div class="p-5">
    <h4 class="mt-2 lg:mt-0 lg:min-h-[40px]"><?php echo $robot['title']?></h4>
  </div>
  <div class="border-t border-solid bg-slate-50 p-5 text-base">
    <div class="flex items-center gap-4">
      <span>Аренда от</span>
      <span class="block h-[6px] flex-1 border-b-4 border-dotted border-black"></span>
      <span class="text-secondary font-bold"><?php echo number_format($robot['rent_2'], 2, ',', ' ')?> ₽</span>
    </div>
    <div class="mt-1 flex items-center gap-4">
      <span>Покупка от</span>
      <span class="block h-[6px] flex-1 border-b-4 border-dotted border-black"></span>
      <span class="text-secondary font-bold"><?php echo number_format($robot['price'], 2, ',', ' ')?> ₽</span>
    </div>
  </div>
  <div class="mt-1 flex items-center justify-between bg-secondary">
    <a href="https://itis-time.ru/price/" class="bg-primary rounded-bl-lg border-none px-4 py-2 text-lg !text-white hover:!text-white lg:cursor-pointer w-full block text-center hover:no-underline no-underline">Заказать</a>
    <a href="<?php echo $robot['link'];?>" class="bg-secondary rounded-br-lg border-none px-4 py-2 text-lg !text-white hover:!text-white lg:cursor-pointer w-full block text-center hover:no-underline no-underline">Подробнее</a>
  </div>
</div>