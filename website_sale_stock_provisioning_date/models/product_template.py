# Copyright 2019 Tecnativa - Ernesto Tejeda
# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
from odoo import fields, models
from odoo.tools.misc import format_date


class ProductTemplate(models.Model):
    _inherit = "product.template"

    show_next_provisioning_date = fields.Boolean(
        help="Shows the next provisioning date in the website shop "
        "if the product is out of stock. This option may not make "
        "sense if you don't select an 'Availability' option that "
        "shows the inventory of the product in the website shop."
    )

    free_qty = fields.Float(search="_search_free_qty")

    def _search_free_qty(self, operator, value):
        domain = [("free_qty", operator, value)]
        product_variant_query = self.env["product.product"]._search(domain)
        return [("product_variant_ids", "in", product_variant_query)]

    def _get_next_provisioning_date(self, company):
        return self.product_variant_ids._get_next_provisioning_date(company)

    def _get_combination_info(
        self,
        combination=False,
        product_id=False,
        add_qty=1,
        uom_id=False,
        only_template=False,
        pricelist=None,
        fiscal_position=None,
    ):
        combination_info = super()._get_combination_info(
            combination=combination,
            product_id=product_id,
            add_qty=add_qty,
            uom_id=uom_id,
            only_template=only_template,
            pricelist=pricelist,
            fiscal_position=fiscal_position,
        )
        if combination_info["product_id"]:
            product = (
                self.env["product.product"]
                .sudo()
                .browse(combination_info["product_id"])
            )
        else:
            product = self.sudo()
        website = self.env.website
        provisioning_date = False
        free_qty = sum(
            website._get_product_available_qty(variant)
            for variant in (
                product
                if product._name == "product.product"
                else product.product_variant_ids
            )
        )
        if product.show_next_provisioning_date and free_qty <= 0:
            company = website.company_id
            provisioning_date = product._get_next_provisioning_date(company)
            provisioning_date = format_date(self.env, provisioning_date)
        combination_info.update(provisioning_date=provisioning_date)
        return combination_info
