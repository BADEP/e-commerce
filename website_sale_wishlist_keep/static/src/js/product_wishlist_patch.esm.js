/* License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl). */

import {WishlistPage} from "@website_sale/interactions/wishlist_page";
import {patch} from "@web/core/utils/patch";

patch(WishlistPage.prototype, {
  /**
   * Keep the product in the wishlist after adding it to the cart, instead
   * of the standard behavior that removes it. The explicit removal button
   * keeps working as usual.
   *
   * @override
   */
  async removeProduct(ev) {
    if (
      ev.type === "product_added_to_cart" &&
      this.el.querySelector("#b2b_wish")?.checked
    ) {
      return;
    }
    return super.removeProduct(...arguments);
  },
});
