<style>
  .myTable11 td {
    padding: 5px;
    border: 1px solid black;
    text-align: center;
  }

  .myTable11 img {
    max-width: 120px;
  }

  .myTable22 td, .myTable33 td {
    padding: 5px;
    border: 1px solid black;
    text-align: center;
  }
  .myTable33 td {
    padding: 5px;
    border: 1px solid black;
    text-align: center;
    width: 33%;
  }
</style>
<h2><?php echo $data['name']?>, здравствуйте!</h2>
<p>
  Благодарим вас за обращение К НАМ. Вы произвели расчёт и получили ориентировочную смету на роботов. В расчёте приведены базовые цены на аренду и приобретение роботов, со стандартным функционалом, но без учёта логистики, кастомизации под бренд и дополнительных услуг/оборудования. Для уточнения стоимости перешлите полученные вами цифры нам на почту info@itis-time.ru c вашим контактным телефоном, мы свяжемся с вами, уточним условия использования роботов и рассчитаем итоговую стоимость и сроки подготовки роботов.
</p>
<br />
<table class="myTable11" style="border: 4px double black; border-collapse: collapse; width: 100%;">
  <tr>
    <td>Робот</td>
    <td>Кол-во</td>
    <td>Часов/день</td>
    <td>Дней</td>
    <td>Аренда</td>
    <td>Покупка</td>
  </tr>
  <?php for ($i=0; $i < count($data['robots']); $i++): $robot = $data['robots'][$i];?>
  <tr>
    <td>
      <a href="<?php echo $robot['link']?>"><?php echo $robot['title']?></a><br> 
      <img src="<?php echo $robot['image']?>" width=""><br>
      <a href="<?php echo $robot['link']?>">Подробнее</a>
    </td>
    <td><?php echo $robot['count']?></td>
    <td>до <?php echo $robot['hours']?> часов</td>
    <td><?php echo $robot['days']?></td>
    <td><?php echo $robot['rentPrice']?></td>
    <td><?php echo $robot['salePrice']?></td>
  </tr>
  <?php endfor; ?>
</table>
<br />
<h3>Итоги:</h3>
<table class="myTable22" style="border: 4px double black; border-collapse: collapse; width: 100%;">
  <tr>
    <td>Аренда</td>
    <td>Покупка</td>
  </tr>
  <tr>
    <td><?php echo $data['totalRentPrice']?></td>
    <td><?php echo $data['totalSalePrice']?></td>
  </tr>
</table>
<br />

<table class="myTable33" style="border: 4px double black; border-collapse: collapse; width: 100%;">
  <tr>
    <td>Имя</td>
    <td>Телефон</td>
    <td>Email</td>
  </tr>
  <tr>
    <td><?php echo $data['name']?></td>
    <td><?php echo $data['phone']?></td>
    <td><?php echo $data['email']?></td>
  </tr>
  <tr>
    <td colspan="3"><?php echo $data['text']?></td>
  </tr>
</table>
<br />
<p>С уважением, команда ГК itis-time.ru
  <br />Группа компаний «Итс Тайм»
  <br />+7 (495) 720-38-70
  <br />E-Mail: info@itis-time.ru
  <br />Москва, метро «Дубровка», ул. 2-я Машиностроения, дом 17, строение 1, офис 102
</p>
